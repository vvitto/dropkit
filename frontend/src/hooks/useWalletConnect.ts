import {toUserFriendlyAddress, useIsConnectionRestored, useTonConnectUI, useTonWallet} from '@tonconnect/ui-react';
import {useCallback, useEffect, useMemo} from 'react';
import {getWalletPayload, validateWallet} from '@/api/wallet';

const tonProofCache = new Map<string, string>();

export const useWalletConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const isConnectionRestored = useIsConnectionRestored();

  useEffect(() => {
    return tonConnectUI.onStatusChange(async (w) => {
      if (!w) {
        return;
      }

      if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
        const cachedPayload = tonProofCache.get(w.connectItems.tonProof.proof.payload);

        try {
          await validateWallet({
            address: w.account.address,
            network: w.account.chain,
            public_key: w.account.publicKey!,
            proof: {
              ...w.connectItems.tonProof.proof,
              payload: cachedPayload || w.connectItems.tonProof.proof.payload,
              state_init: w.account.walletStateInit,
            },
          });
        } catch (error) {
          console.error('Failed to validate proof:', error);
          await tonConnectUI.disconnect();
        }
      }
    });
  }, [tonConnectUI]);

  const connect = useCallback(async () => {
    tonConnectUI.setConnectRequestParameters({ state: 'loading' });
    tonConnectUI.openModal();

    try {
      const { ton_proof, ton_proof_hash } = await getWalletPayload();
      tonProofCache.set(ton_proof_hash, ton_proof);

      tonConnectUI.setConnectRequestParameters({
        state: 'ready',
        value: {
          tonProof: ton_proof_hash,
        },
      });
    } catch (error) {
      console.error('Failed to get payload:', error);
      tonConnectUI.closeModal();
      tonConnectUI.setConnectRequestParameters(null);
    }
  }, [tonConnectUI]);

  const disconnect = useCallback(() => {
    tonConnectUI.disconnect();
  }, [tonConnectUI]);

  const address = useMemo(() => {
    if (!wallet) return null;
    return toUserFriendlyAddress(wallet.account.address);
  }, [wallet]);

  const shortAddress = useMemo(() => {
    if (!address) return null;
    return address.slice(0, 4) + '...' + address.slice(-4);
  }, [address]);

  return {
    wallet,
    address,
    shortAddress,
    isConnectionRestored,
    isConnected: !!wallet,
    connect,
    disconnect
  };
};
