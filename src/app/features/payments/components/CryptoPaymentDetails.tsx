import { useState } from 'react'
import { Button, Tooltip } from '@heroui/react'
import { AlertCircle, Check, Copy } from 'lucide-react'
import { CashDepositUpload } from './CashDepositUpload'

// Wallet addresses for crypto payments
const CRYPTO_WALLETS = [
  {
    key: 'BEP20',
    address: '0x705eaf420f28a22380ec0ddb931464f85e2d4502',
    network: 'BEP-20',
    networkShort: 'BSC',
    color: 'bg-yellow-500',
    borderColor: 'border-l-yellow-500',
  },
  {
    key: 'TRC20',
    address: 'TJnUCSEg7S1sXDz6rf9oeEFbYr4QytPE57',
    network: 'TRC-20',
    networkShort: 'TRON',
    color: 'bg-red-500',
    borderColor: 'border-l-red-500',
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

  return (
    <div className="space-y-4">
      {/* Warning compacto */}
      <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          Solo envía <strong>USDT</strong> - Verifica la red antes de enviar
        </span>
      </div>

      {/* Wallet Cards - Grid 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CRYPTO_WALLETS.map((wallet) => (
          <div
            key={wallet.key}
            className={`border-l-4 ${wallet.borderColor} bg-gray-50 rounded-lg p-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 ${wallet.color} text-white text-xs font-bold rounded`}
              >
                {wallet.network}
              </span>
              <span className="text-xs text-gray-500">{wallet.networkShort}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white rounded text-xs font-mono break-all select-all border">
                {wallet.address}
              </code>
              <Tooltip
                content={copiedWallet === wallet.network ? 'Copiado!' : 'Copiar'}
              >
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  color={copiedWallet === wallet.network ? 'success' : 'default'}
                  onPress={() => handleCopyAddress(wallet.address, wallet.network)}
                  className="min-w-8 h-8"
                >
                  {copiedWallet === wallet.network ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      {showUpload && onImageSelect && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Sube el comprobante de transferencia:
          </p>
          <CashDepositUpload
            onImageSelect={onImageSelect}
            selectedImage={selectedImage ?? null}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
