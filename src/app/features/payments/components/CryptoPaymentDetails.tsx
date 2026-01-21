import { useState } from 'react'
import { Button } from '@heroui/react'
import { AlertCircle, Check, Copy } from 'lucide-react'
import { CashDepositUpload } from './CashDepositUpload'

const CRYPTO_WALLETS = [
  {
    key: 'BEP20',
    address: '0x705eaf420f28a22380ec0ddb931464f85e2d4502',
    network: 'BEP-20',
    badgeColor: 'bg-amber-500',
  },
  {
    key: 'TRC20',
    address: 'TJnUCSEg7S1sXDz6rf9oeEFbYr4QytPE57',
    network: 'TRC-20',
    badgeColor: 'bg-rose-500',
  },
]

interface CryptoPaymentDetailsProps {
  onImageSelect?: (file: File | null) => void
  selectedImage?: File | null
  disabled?: boolean
  showUpload?: boolean
}

export const CryptoPaymentDetails = ({
  onImageSelect,
  selectedImage,
  disabled = false,
  showUpload = true,
}: CryptoPaymentDetailsProps) => {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null)

  const handleCopyAddress = async (address: string, network: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedWallet(network)
      setTimeout(() => setCopiedWallet(null), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  return (
    <div className="space-y-2">
      {/* Warning inline */}
      <div className="flex items-center gap-1.5 text-xs text-amber-600">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Solo USDT - Verifica la red</span>
      </div>

      {/* Wallets compactas */}
      {CRYPTO_WALLETS.map((wallet) => (
        <div
          key={wallet.key}
          className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg"
        >
          <span
            className={`px-1.5 py-0.5 ${wallet.badgeColor} text-white text-[10px] font-bold rounded shrink-0`}
          >
            {wallet.network}
          </span>
          <code
            className="flex-1 text-xs font-mono text-gray-600 truncate cursor-pointer"
            onClick={() => handleCopyAddress(wallet.address, wallet.network)}
            title={wallet.address}
          >
            {truncateAddress(wallet.address)}
          </code>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color={copiedWallet === wallet.network ? 'success' : 'default'}
            onPress={() => handleCopyAddress(wallet.address, wallet.network)}
            className="h-6 w-6 min-w-6"
          >
            {copiedWallet === wallet.network ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      ))}

      {/* Upload compacto */}
      {showUpload && onImageSelect && (
        <CashDepositUpload
          onImageSelect={onImageSelect}
          selectedImage={selectedImage ?? null}
          disabled={disabled}
        />
      )}
    </div>
  )
}
