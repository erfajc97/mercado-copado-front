import { Button } from 'antd'
import { CryptoPaymentDetails } from '@/app/features/payments/components/CryptoPaymentDetails'

interface CryptoTabProps {
  depositImage: File | null
  setDepositImage: (file: File | null) => void
  isCryptoDepositPending: boolean
  onCryptoDepositSubmit: () => void
}

export const CryptoTab = ({
  depositImage,
  setDepositImage,
  isCryptoDepositPending,
  onCryptoDepositSubmit,
}: CryptoTabProps) => {
  return (
    <div className="py-4 space-y-4">
      <CryptoPaymentDetails
        onImageSelect={setDepositImage}
        selectedImage={depositImage}
        showUpload={true}
      />
      <Button
        type="primary"
        size="large"
        onClick={onCryptoDepositSubmit}
        loading={isCryptoDepositPending}
        disabled={!depositImage || isCryptoDepositPending}
        className="w-full bg-gradient-coffee border-none hover:opacity-90"
      >
        {isCryptoDepositPending ? 'Procesando...' : 'Enviar Comprobante Crypto'}
      </Button>
    </div>
  )
}
