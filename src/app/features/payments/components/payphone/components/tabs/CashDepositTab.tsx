import { Button } from 'antd'
import { CashDepositUpload } from '@/app/features/payments/components/CashDepositUpload'

interface CashDepositTabProps {
  depositImage: File | null
  setDepositImage: (file: File | null) => void
  isCashDepositPending: boolean
  onCashDepositSubmit: () => void
}

export const CashDepositTab = ({
  depositImage,
  setDepositImage,
  isCashDepositPending,
  onCashDepositSubmit,
}: CashDepositTabProps) => {
  return (
    <div className="py-4 space-y-4">
      <CashDepositUpload
        onImageSelect={setDepositImage}
        selectedImage={depositImage}
      />
      <Button
        type="primary"
        size="large"
        onClick={onCashDepositSubmit}
        loading={isCashDepositPending}
        disabled={!depositImage || isCashDepositPending}
        className="w-full bg-gradient-coffee border-none hover:opacity-90"
      >
        {isCashDepositPending ? 'Procesando...' : 'Enviar Comprobante'}
      </Button>
    </div>
  )
}
