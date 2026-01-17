# Estándares de Refactorización de Features

Este documento define las buenas prácticas y estructura estándar para refactorizar features en el proyecto, basado en la refactorización exitosa de la feature `cart`.

## 📁 Estructura de Carpetas

Cada feature debe seguir esta estructura:

```
src/app/features/{feature-name}/
├── components/          # Componentes de UI (solo JSX)
│   ├── {ComponentName}.tsx
│   └── modals/         # Modales de la feature
│       └── {ModalName}Modal.tsx
├── hooks/              # Lógica de negocio (máximo 2-3 hooks por feature)
│   ├── use{Component}Hook.ts
│   └── use{Feature}Hook.ts
├── mutations/          # Mutaciones de TanStack Query
│   └── use{Feature}Mutations.ts
├── queries/            # Queries de TanStack Query
│   └── use{Feature}Query.ts
├── services/           # Llamadas a API (axios)
│   └── {action}Service.ts
├── helpers/            # Funciones helper reutilizables
│   └── {helperFunction}.ts
└── {Feature}.tsx       # Componente principal de la feature (OBLIGATORIO)
```

## 🎯 Componente Principal de la Feature

**REQUERIMIENTO OBLIGATORIO:**

Cada feature DEBE tener un componente principal `{Feature}.tsx` en la raíz de la feature. Este componente es el punto de entrada/raíz de la feature y debe cumplir con los siguientes criterios:

**Características:**

- ✅ Nombre: `{Feature}.tsx` (ej: `Cart.tsx`, `Checkout.tsx`, `Addresses.tsx`)
- ✅ Ubicación: Raíz de la feature (`src/app/features/{feature-name}/{Feature}.tsx`)
- ✅ Se importa desde las rutas como punto de entrada principal
- ✅ Contiene la estructura principal y visualización de la feature
- ✅ Usa el hook principal de la feature (`use{Feature}Hook.ts`)
- ✅ Puede mostrar listas, formularios, o cualquier contenido principal
- ✅ Es reutilizable y puede ser importado en otras partes de la aplicación

**Ejemplo:**

```typescript
// Cart.tsx - Componente principal de la feature cart
import { useCartHook } from './hooks/useCartHook'

export function Cart() {
  const {
    cartItems,
    isLoading,
    total,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useCartHook()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!cartItems || cartItems.length === 0) {
    return <div>Carrito vacío</div>
  }

  return (
    <div>
      <h1>Mi Carrito</h1>
      {/* Renderizar lista de items */}
    </div>
  )
}
```

**Uso en rutas:**

```typescript
// routes/cart.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Cart } from '@/app/features/cart/Cart'

export const Route = createFileRoute('/cart')({
  component: Cart,
})
```

**Importante:**

- El componente principal NO debe contener lógica de negocio (esa va en hooks)
- El componente principal NO debe hacer llamadas directas a servicios (usa queries/mutations)
- El componente principal DEBE ser el punto de entrada claro de la feature

## 🔄 Principio DRY (Don't Repeat Yourself)

**REQUERIMIENTO OBLIGATORIO:**

**NO duplicar componentes que existen en otras features.** Si un componente ya existe en otra feature, debe importarse y reutilizarse en lugar de crearse una copia.

**Reglas Fundamentales:**

- ✅ **Si necesitas renderizar un componente de otra feature, importa el componente existente, no lo dupliques**
- ✅ Los componentes deben estar en la feature que les corresponde lógicamente
- ✅ Los componentes deben ser exportados como públicos para permitir su reutilización
- ❌ NO crear componentes duplicados en diferentes features
- ❌ NO tener componentes que no corresponden a la feature actual

**Ejemplos de Componentes por Feature:**

- `EmptyCart` → Pertenece a `cart` feature
- `AddressModal` → Pertenece a `addresses` feature
- `FormAddresses` → Pertenece a `addresses` feature
- `PaymentMethodModal` → Pertenece a `payment-methods` feature

**Ejemplo de Reutilización Correcta:**

```typescript
// ❌ INCORRECTO - Duplicar componente
// src/app/features/checkout/components/EmptyCart.tsx
export const EmptyCart = () => {
  return <div>Carrito vacío</div>
}

// ✅ CORRECTO - Importar de la feature correspondiente
// src/app/features/checkout/Checkout.tsx
import { EmptyCart } from '@/app/features/cart/components/EmptyCart'

export const Checkout = () => {
  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />
  }
  // ...
}
```

## 🔗 Reutilización de Componentes entre Features

**Cuándo es Apropiado Importar de Otra Feature:**

- ✅ Cuando el componente representa una entidad de otra feature (ej: `AddressModal` para direcciones)
- ✅ Cuando el componente es genérico y reutilizable (ej: `EmptyCart` para mostrar carrito vacío)
- ✅ Cuando el componente ya existe y cumple con los requisitos necesarios
- ❌ NO importar componentes específicos de una feature que no tienen sentido en otra

**Cómo Estructurar Imports entre Features:**

```typescript
// Importar componente de otra feature usando alias @
import { EmptyCart } from '@/app/features/cart/components/EmptyCart'
import { AddressModal } from '@/app/features/addresses/components/modals/AddressModal'
import { FormAddresses } from '@/app/features/addresses/components/FormAddresses'
```

**Componentes Reutilizables vs Específicos:**

**Reutilizables (pueden importarse):**

- `EmptyCart` - Muestra carrito vacío (útil en cart y checkout)
- `AddressModal` - Modal para crear/editar direcciones (útil en addresses y checkout)
- `FormAddresses` - Formulario de direcciones (útil en addresses y checkout)
- `PaymentMethodModal` - Modal para métodos de pago (útil en payment-methods y checkout)

**Específicos (no deben importarse):**

- `AddressSelectorModal` - Específico de checkout (selección de dirección en checkout)
- `PaymentMethodFormModal` - Específico de checkout (formulario de pago en checkout)
- `CartDrawer` - Específico de cart (drawer del carrito)

**Proceso para Determinar si un Componente es Reutilizable:**

1. ¿El componente representa una entidad de otra feature? → Importar de esa feature
2. ¿El componente es genérico y puede usarse en múltiples contextos? → Crear en feature apropiada e importar
3. ¿El componente es específico del flujo de la feature actual? → Crear en la feature actual

**Ejemplo Completo de Reutilización:**

```typescript
// src/app/features/checkout/Checkout.tsx
// ✅ Importar EmptyCart de cart (no duplicar)
import { EmptyCart } from '@/app/features/cart/components/EmptyCart'

// ✅ Importar AddressModal de addresses (no duplicar)
import { AddressModal } from '@/app/features/addresses/components/modals/AddressModal'

export const Checkout = () => {
  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart /> // Reutilizado de cart
  }

  return (
    <div>
      {/* Usar AddressModal de addresses */}
      <AddressModal {...props} />
    </div>
  )
}
```

## 🎯 Principios Fundamentales

### 1. Separación de Responsabilidades

**Hooks (`hooks/`):**

- ✅ Toda la lógica de negocio
- ✅ Estados (`useState`, `useMemo`, `useRef`)
- ✅ Efectos (`useEffect` solo cuando sea estrictamente necesario)
- ✅ Funciones de manejo de eventos
- ✅ Cálculos y transformaciones de datos
- ❌ NO incluir JSX

**Componentes (`components/`):**

- ✅ Solo JSX y estructura visual
- ✅ Llamadas al hook correspondiente
- ✅ Renderizado condicional
- ✅ **Responsabilidad Única**: Cada componente debe tener una única responsabilidad, evitando componentes grandes y complejos
- ✅ **Componentes Pequeños y Mantenibles**: Dividir componentes grandes en componentes más pequeños y específicos
- ❌ NO incluir lógica de negocio
- ❌ NO incluir `useState`, `useEffect` (excepto casos muy específicos)
- ❌ NO incluir cálculos complejos (usar helpers o hooks)
- ❌ NO incluir constantes o datos hardcodeados (usar archivos de constantes)

**Ejemplo:**

```typescript
// ✅ CORRECTO - Hook con lógica
// hooks/useCartDrawerHook.ts
export const useCartDrawerHook = ({ onClose }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: items } = useCartQuery()

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])

  const handleCheckout = () => {
    // lógica aquí
  }

  return { items, total, handleCheckout, isModalOpen, setIsModalOpen }
}

// ✅ CORRECTO - Componente solo con JSX
// components/CartDrawer.tsx
export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, total, handleCheckout, isModalOpen, setIsModalOpen } =
    useCartDrawerHook({ onClose })

  return (
    <Drawer open={isOpen} onClose={onClose}>
      {/* Solo JSX aquí */}
    </Drawer>
  )
}
```

### 2. Uso de TanStack Query

**Queries (`queries/`):**

- Usar para obtener datos del servidor
- Incluir opciones como `enabled` para controlar cuándo se ejecuta
- Retornar datos transformados si es necesario

```typescript
// queries/useCartQuery.ts
export const useCartQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => getCartService(),
    enabled: options?.enabled !== false,
  })
}
```

**Mutations (`mutations/`):**

- Usar para modificar datos (crear, actualizar, eliminar)
- Incluir invalidación de queries relacionadas
- Manejar estados de loading y error

```typescript
// mutations/useCartMutations.ts
export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCartItemService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
```

### 3. Evitar useEffect Innecesarios

**❌ EVITAR:**

```typescript
// Mal - useEffect innecesario
useEffect(() => {
  if (user) {
    fetchData()
  }
}, [user])
```

**✅ PREFERIR:**

```typescript
// Bien - Usar TanStack Query con enabled
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  enabled: !!user,
})

// O usar funciones directamente
const handleAction = () => {
  if (user) {
    fetchData()
  }
}
```

**✅ useEffect solo cuando sea necesario:**

- Sincronización con APIs externas
- Suscripciones/desuscripciones
- Efectos de limpieza
- Sincronización de estado local con estado global

### 4. Uso de HeroUI vs Ant Design

**✅ USAR HeroUI para:**

- Botones (`Button` de `@heroui/react`)
- Modales (`CustomModalNextUI` de `@/components/UI/customModalNextUI/CustomModalNextUI`)
- Tablas (`CustomTableNextUi` de `@/components/UI/table-nextui/CustomTableNextUi`)
- Paginación (`CustomPagination` de `@/components/UI/table-nextui/CustomPagination`)
- Dropdowns (`CustomDropDownNextUi` de `@/components/UI/customDropDown/nextUi/CustomDropDownNextUi`)
- Otros componentes UI modernos

**⚠️ MANTENER Ant Design solo para:**

- `Drawer` (no hay alternativa en HeroUI)
- `Empty` (puede reemplazarse por componente custom si es necesario)
- Componentes legacy que aún no se han migrado

**Ejemplo de migración:**

```typescript
// ❌ ANTES - Ant Design
import { Button } from 'antd'

<Button type="primary" block onClick={handleClick}>
  Click me
</Button>

// ✅ DESPUÉS - HeroUI
import { Button } from '@heroui/react'

<Button
  color="primary"
  className="w-full"
  onPress={handleClick}
>
  Click me
</Button>
```

### 5. Organización de Modales

**Estructura:**

- Cada modal debe estar en `components/modals/`
- Nombre: `{Action}{Entity}Modal.tsx` (ej: `ClearCartModal.tsx`, `DeleteAddressModal.tsx`)
- Usar `CustomModalNextUI` como wrapper
- Botones dentro del modal deben ser de HeroUI

**REQUERIMIENTO OBLIGATORIO:**

- ✅ **Siempre que exista un botón de eliminar, DEBE existir una modal de confirmación de eliminación**
- ✅ La modal de eliminación debe seguir el patrón `Delete{Entity}Modal.tsx`
- ✅ Debe mostrar un mensaje de confirmación claro
- ✅ Debe tener botones "Cancelar" y "Sí, Eliminar" (o similar)
- ✅ El botón de confirmación debe ser de color `danger` (HeroUI)
- ✅ Debe manejar el estado de loading durante la eliminación

**Ejemplo:**

```typescript
// components/modals/ClearCartModal.tsx
import { Button } from '@heroui/react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface ClearCartModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export default function ClearCartModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ClearCartModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="md"
      placement="center"
      headerContent="Limpiar Carrito"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={async () => {
              await onConfirm()
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sí, Limpiar
          </Button>
        </div>
      }
    >
      <p className="text-gray-700">
        ¿Estás seguro de que deseas limpiar todo el carrito?
      </p>
    </CustomModalNextUI>
  )
}
```

**Uso en componente:**

```typescript
// components/CartDrawer.tsx
import ClearCartModal from './modals/ClearCartModal'
import { useDisclosure } from '@heroui/react'

export default function CartDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen}>Abrir Modal</Button>
      <ClearCartModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  )
}
```

**Ejemplo de Modal de Eliminación (REQUERIMIENTO OBLIGATORIO):**

```typescript
// components/modals/DeleteAddressModal.tsx
import { Button } from '@heroui/react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface DeleteAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export default function DeleteAddressModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAddressModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="md"
      placement="center"
      headerContent="Eliminar Dirección"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={async () => {
              await onConfirm()
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sí, Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-gray-700">
        ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se
        puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
```

**Uso en componente con botón de eliminar:**

```typescript
// Addresses.tsx
import DeleteAddressModal from './components/modals/DeleteAddressModal'

export function Addresses() {
  const {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAddress,
    isDeletingAddress,
  } = useAddressesHook()

  return (
    <>
      {/* Botón de eliminar - abre la modal de confirmación */}
      <button onClick={() => openDeleteModal(address.id)}>
        <Trash2 size={18} />
      </button>

      {/* Modal de confirmación OBLIGATORIA */}
      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAddress}
        isLoading={isDeletingAddress}
      />
    </>
  )
}
```

**Ejemplo de Modal de Eliminación (REQUERIMIENTO OBLIGATORIO):**

```typescript
// components/modals/DeleteAddressModal.tsx
import { Button } from '@heroui/react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface DeleteAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export default function DeleteAddressModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAddressModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="md"
      placement="center"
      headerContent="Eliminar Dirección"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={async () => {
              await onConfirm()
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sí, Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-gray-700">
        ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se
        puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
```

**Uso en componente con botón de eliminar:**

```typescript
// Addresses.tsx
import DeleteAddressModal from './components/modals/DeleteAddressModal'

export function Addresses() {
  const {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAddress,
    isDeletingAddress,
  } = useAddressesHook()

  return (
    <>
      {/* Botón de eliminar - abre la modal de confirmación */}
      <button onClick={() => openDeleteModal(address.id)}>
        <Trash2 size={18} />
      </button>

      {/* Modal de confirmación OBLIGATORIA */}
      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAddress}
        isLoading={isDeletingAddress}
      />
    </>
  )
}
```

### 6. Forms como Componentes Separados

**REQUERIMIENTO:**

Los formularios deben ser componentes separados en `components/` para mantener la separación de responsabilidades y reutilización.

**Estructura:**

- Nombre: `Form{Entity}.tsx` (ej: `FormAddresses.tsx`, `FormPaymentMethod.tsx`)
- Ubicación: `components/Form{Entity}.tsx`
- Se importan en modales o componentes que los necesiten
- Props deben ser explícitas y tipadas
- Solo contiene JSX del formulario, sin lógica de negocio

**Características:**

- ✅ Solo JSX del formulario (campos, validaciones visuales)
- ✅ Props tipadas explícitamente
- ✅ Lógica de negocio en hooks (no en el form)
- ✅ Reutilizable en diferentes contextos (modales, páginas, etc.)

**Ejemplo:**

```typescript
// components/FormAddresses.tsx
import { Form, Input, Select } from 'antd'
import type { Address, CreateAddressData } from '../types'

interface FormAddressesProps {
  form: ReturnType<typeof Form.useForm<CreateAddressData>>[0]
  addresses: Array<Address> | undefined
  isLoading: boolean
  editingAddress: Address | null
  onFinish: (values: CreateAddressData) => Promise<void>
  onCancel?: () => void
}

export function FormAddresses({
  form,
  addresses,
  isLoading,
  editingAddress,
  onFinish,
  onCancel,
}: FormAddressesProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="mt-4"
    >
      {/* Campos del formulario */}
      <Form.Item name="street" label="Dirección">
        <Input size="large" />
      </Form.Item>
      {/* ... más campos */}
    </Form>
  )
}
```

**Uso en modal:**

```typescript
// components/modals/AddressModal.tsx
import { FormAddresses } from '../FormAddresses'

export function AddressModal({ isOpen, onClose, ...props }) {
  return (
    <CustomModalNextUI isOpen={isOpen} onOpenChange={handleOpenChange}>
      <FormAddresses {...props} onCancel={onClose} />
    </CustomModalNextUI>
  )
}
```

### 7. Diseño de Formularios Agrupados

**REQUERIMIENTO:**

Los formularios en modales deben agrupar campos visualmente para mejorar la UX y evitar modales muy largas.

**Principios de Diseño:**

- ✅ Agrupar de 2 en 2 campos relacionados
- ✅ Usar **grid de 2 columnas** para campos relacionados (lado a lado)
- ✅ Campos relacionados deben estar en la misma fila usando `grid grid-cols-2 gap-4`
- ✅ Campos de texto largo (TextArea) ocupan el ancho completo
- ✅ **NO usar líneas de división** (borders) para ahorrar espacio vertical
- ✅ **Espacios verticales reducidos** (`mb-3` en lugar de `mb-6`, `mt-2` en lugar de `mt-4`)
- ✅ Evitar modales muy largas que requieran mucho scroll

**Estructura de Grupos:**

1. **Grupo 1:** Campos principales relacionados (ej: País y Ciudad)
2. **Grupo 2:** Campos secundarios relacionados (ej: Estado y Código Postal)
3. **Grupo 3:** Campos de texto largo (ej: Dirección completa)
4. **Grupo 4:** Campos opcionales (ej: Referencia)
5. **Grupo 5:** Checkboxes o opciones (ej: isDefault)
6. **Grupo 6:** Botones de acción

**Ejemplo de Agrupación con Grid de 2 Columnas:**

```typescript
// components/FormAddresses.tsx
export function FormAddresses({ form, onFinish }: Props) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Grupo 1: País y Ciudad (lado a lado) */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Form.Item name="country" label="País">
          <Select size="large" />
        </Form.Item>
        <Form.Item name="city" label="Ciudad">
          <Input size="large" />
        </Form.Item>
      </div>

      {/* Grupo 2: Estado y Código Postal (lado a lado) */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Form.Item name="state" label="Estado/Departamento">
          <Input size="large" />
        </Form.Item>
        <Form.Item name="zipCode" label="Código Postal">
          <Input size="large" />
        </Form.Item>
      </div>

      {/* Grupo 3: Dirección (campo largo) */}
      <div className="mb-3">
        <Form.Item name="street" label="Dirección">
          <Input.TextArea rows={3} />
        </Form.Item>
      </div>

      {/* Grupo 4: Referencia (opcional) */}
      <div className="mb-3">
        <Form.Item name="reference" label="Referencia (Opcional)">
          <Input.TextArea rows={2} />
        </Form.Item>
      </div>

      {/* Grupo 5: Checkbox */}
      {addresses && addresses.length > 0 && (
        <div className="mb-3">
          <Form.Item name="isDefault" valuePropName="checked">
            <input type="checkbox" />
            <span>Establecer como dirección por defecto</span>
          </Form.Item>
        </div>
      )}

      {/* Grupo 6: Botones */}
      <Form.Item>
        <div className="flex gap-2 justify-end">
          <Button onPress={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </Form.Item>
    </Form>
  )
}
```

**Técnicas de Agrupación:**

- Usar `grid grid-cols-2 gap-4` para campos relacionados (2 columnas lado a lado)
- Usar `div` con clases de espaciado reducido (`mb-3` en lugar de `mb-6`)
- **NO usar bordes de división** (`border-b`) para ahorrar espacio vertical
- **NO usar padding extra** (`pb-4`) para reducir altura del formulario
- Usar `mt-2` en el Form en lugar de `mt-4` para reducir espacio superior
- Campos de texto largo (TextArea) ocupan el ancho completo (sin grid)
- Mantener layout vertical del Form pero con campos lado a lado dentro de cada grupo
- Priorizar formularios compactos que ocupen menos espacio vertical

### 8. Evitar Duplicación de Modales con Mismo Formulario

**REQUERIMIENTO OBLIGATORIO:**

Si dos modales (crear/editar) usan el mismo formulario, **DEBEN unificarse en una sola modal** para evitar duplicación de código.

**Patrón de Unificación:**

- ✅ Una sola modal que recibe `entityId: string | null` como prop
- ✅ Si `entityId` es `null`, es modo creación
- ✅ Si `entityId` tiene valor, es modo edición
- ✅ El hook detecta el modo y usa la mutación correspondiente
- ✅ El formulario es un componente separado reutilizable (`Form{Entity}.tsx`)
- ✅ Título y botones dinámicos según el modo

**Estructura:**

```
components/
├── modals/
│   └── {Entity}Modal.tsx      # Modal unificada (crear/editar)
└── Form{Entity}.tsx           # Formulario reutilizable
hooks/
└── use{Entity}ModalHook.ts    # Hook unificado que detecta modo
```

**Ejemplo Completo:**

```typescript
// hooks/useProductModalHook.ts
export const useProductModalHook = (
  productId: string | null,
  isOpen: boolean,
) => {
  const isEditMode = !!productId
  
  // Si es edición, cargar datos
  const { data: product, isLoading } = useProductQuery(
    productId || '',
    { enabled: isEditMode && isOpen },
  )
  
  // Mutations según el modo
  const { mutateAsync: createProduct } = useCreateProductMutation()
  const { mutateAsync: updateProduct } = useUpdateProductMutation()
  
  const handleSubmit = async (values: any) => {
    if (isEditMode) {
      await updateProduct({ productId: productId!, data: values })
    } else {
      await createProduct(values)
    }
  }
  
  return {
    // ... otros valores
    isEditMode,
    handleSubmit,
  }
}
```

```typescript
// components/modals/ProductModal.tsx
interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string | null // null = crear, string = editar
}

export default function ProductModal({
  isOpen,
  onClose,
  productId,
}: ProductModalProps) {
  const [form] = Form.useForm()
  const {
    categories,
    subcategories,
    handleSubmit,
    isEditMode,
    // ... otros valores
  } = useProductModalHook(productId, isOpen)

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      headerContent={isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
    >
      <FormProduct
        form={form}
        categories={categories}
        subcategories={subcategories}
        isEditMode={isEditMode}
        onFinish={handleSubmit}
      />
      <Button onPress={() => form.submit()}>
        {isEditMode ? 'Guardar Cambios' : 'Crear Producto'}
      </Button>
    </CustomModalNextUI>
  )
}
```

```typescript
// components/FormProduct.tsx
interface FormProductProps {
  form: FormInstance
  categories: Array<Category>
  subcategories: Array<Subcategory>
  isEditMode?: boolean
  onFinish?: (values: any) => void
}

export const FormProduct = ({
  form,
  categories,
  subcategories,
  isEditMode = false,
  onFinish,
}: FormProductProps) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Campos del formulario */}
    </Form>
  )
}
```

**Uso en el componente principal:**

```typescript
// Products.tsx
const { productModalOpen, productToEdit, setProductModalOpen } = useProductsStore()

// Para crear: productToEdit = null
<Button onPress={() => {
  setProductToEdit(null)
  setProductModalOpen(true)
}}>
  Nuevo Producto
</Button>

// Para editar: productToEdit = "product-id"
<Button onPress={() => {
  setProductToEdit(product.id)
  setProductModalOpen(true)
}}>
  Editar
</Button>

// Una sola modal
<ProductModal
  isOpen={productModalOpen}
  onClose={() => setProductModalOpen(false)}
  productId={productToEdit} // null = crear, string = editar
/>
```

**Ventajas:**

- ✅ Elimina duplicación de código
- ✅ Mantiene consistencia entre crear y editar
- ✅ Facilita mantenimiento (un solo lugar para cambios)
- ✅ Reduce tamaño del código
- ✅ Mejora la experiencia de desarrollo

**Reglas Importantes:**

- ❌ NO crear modales separadas para crear y editar si usan el mismo formulario
- ❌ NO duplicar el JSX del formulario en múltiples modales
- ✅ SÍ unificar en una sola modal con `entityId: string | null`
- ✅ SÍ extraer el formulario a un componente reutilizable
- ✅ SÍ usar un hook unificado que detecte el modo

### 9. Organización de Tabs

**REQUERIMIENTO OBLIGATORIO:**

Cuando un componente utiliza tabs (pestañas), **DEBE existir un componente padre/contenedor** que gestione las tabs y llame a los componentes específicos que se renderizan en cada tab.

**Estructura:**

```
components/
├── {ComponentName}.tsx          # Componente principal (modal, página, etc.)
└── tabs/                        # Carpeta para componentes de tabs
    ├── {ComponentName}Tabs.tsx  # Componente contenedor de tabs (OBLIGATORIO)
    ├── {TabName}Tab.tsx         # Componente específico para cada tab
    └── {AnotherTab}Tab.tsx      # Otro componente de tab
```

**Características del Componente Contenedor de Tabs:**

- ✅ Nombre: `{ComponentName}Tabs.tsx` (ej: `PaymentRetryModalTabs.tsx`)
- ✅ Ubicación: `components/tabs/{ComponentName}Tabs.tsx`
- ✅ Gestiona la configuración de las tabs (items, labels, keys)
- ✅ Llama a los componentes específicos de cada tab
- ✅ Pasa las props necesarias a cada tab
- ✅ Facilita agregar nuevas tabs en el futuro (Mercado Pago, Crypto, etc.)

**Características de los Componentes de Tab:**

- ✅ Nombre: `{TabName}Tab.tsx` (ej: `PayphoneTab.tsx`, `CashDepositTab.tsx`)
- ✅ Ubicación: `components/tabs/{TabName}Tab.tsx`
- ✅ Componente independiente y reutilizable
- ✅ Solo contiene el contenido específico de esa tab
- ✅ Props tipadas explícitamente
- ✅ Reutiliza componentes existentes cuando sea posible

**Ejemplo Completo:**

```typescript
// components/tabs/PaymentRetryModalTabs.tsx - Componente contenedor
import { Tabs } from 'antd'
import { CreditCard, Image as ImageIcon } from 'lucide-react'
import { PayphoneTab } from './PayphoneTab'
import { CashDepositTab } from './CashDepositTab'

interface PaymentRetryModalTabsProps {
  activeTab: string
  onTabChange: (key: string) => void
  // Props para PayphoneTab
  orderAmount: number
  addressId: string
  // Props para CashDepositTab
  depositImage: File | null
  setDepositImage: (file: File | null) => void
  // ... más props
}

export const PaymentRetryModalTabs = ({
  activeTab,
  onTabChange,
  orderAmount,
  addressId,
  depositImage,
  setDepositImage,
  // ... más props
}: PaymentRetryModalTabsProps) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      items={[
        {
          key: 'payphone',
          label: (
            <span className="flex items-center gap-2">
              <CreditCard size={16} />
              Payphone
            </span>
          ),
          children: (
            <PayphoneTab
              orderAmount={orderAmount}
              addressId={addressId}
              // ... más props específicas de PayphoneTab
            />
          ),
        },
        {
          key: 'cash',
          label: (
            <span className="flex items-center gap-2">
              <ImageIcon size={16} />
              Depósito en Efectivo
            </span>
          ),
          children: (
            <CashDepositTab
              depositImage={depositImage}
              setDepositImage={setDepositImage}
              // ... más props específicas de CashDepositTab
            />
          ),
        },
        // Fácil agregar nuevas tabs:
        // {
        //   key: 'mercadopago',
        //   label: 'Mercado Pago',
        //   children: <MercadoPagoTab {...props} />,
        // },
      ]}
    />
  )
}
```

```typescript
// components/tabs/PayphoneTab.tsx - Componente específico de tab
import { PayPhoneButtonsContainer } from '../../shared/components/PayPhoneButtonsContainer'

interface PayphoneTabProps {
  orderAmount: number
  addressId: string
  // ... más props
}

export const PayphoneTab = ({
  orderAmount,
  addressId,
  // ... más props
}: PayphoneTabProps) => {
  return (
    <div className="py-4">
      <PayPhoneButtonsContainer
        amount={orderAmount}
        addressId={addressId}
        // ... más props
      />
    </div>
  )
}
```

```typescript
// components/PaymentRetryModal.tsx - Componente principal
import { PaymentRetryModalTabs } from './tabs/PaymentRetryModalTabs'

export const PaymentRetryModal = ({ open, onCancel, ...props }) => {
  const { activeTab, handleTabChange, ...hookValues } = usePaymentRetryModalHook()

  return (
    <CustomModalNextUI isOpen={open} onOpenChange={handleOpenChange}>
      <PaymentRetryModalTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        {...props}
        {...hookValues}
      />
    </CustomModalNextUI>
  )
}
```

**Ventajas de esta Estructura:**

- ✅ **Separación de responsabilidades**: Cada tab es un componente independiente
- ✅ **Fácil de extender**: Agregar nuevas tabs es solo crear un componente y agregarlo al contenedor
- ✅ **Reutilización**: Los componentes de tab pueden reutilizar componentes existentes
- ✅ **Mantenibilidad**: Código más limpio y organizado
- ✅ **Escalabilidad**: Fácil agregar Mercado Pago, Crypto, u otros métodos de pago

**Reglas Importantes:**

- ❌ NO poner la lógica de tabs directamente en el componente principal
- ❌ NO duplicar código entre tabs (usar componentes compartidos)
- ❌ NO mezclar la lógica de múltiples tabs en un solo componente
- ✅ SÍ crear un componente contenedor para las tabs
- ✅ SÍ crear un componente separado para cada tab
- ✅ SÍ reutilizar componentes existentes dentro de las tabs

### 10. Manejo de Estado Global (Zustand)

**Cuándo usar Zustand:**

- Estado que necesita persistirse (localStorage)
- Estado compartido entre múltiples componentes
- Estado que no requiere sincronización con servidor

**Estructura:**

```
src/app/store/{feature-name}/
└── {feature}Store.ts
```

**Ejemplo:**

```typescript
// store/cart/cartStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

### 11. Servicios (API Calls)

**Estructura:**

- Un archivo por acción: `{action}Service.ts`
- Usar `axiosInstance` de `@/app/config/axiosConfig`
- Manejar errores apropiadamente
- Retornar datos transformados si es necesario

**Ejemplo:**

```typescript
// services/getCartService.ts
import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const getCartService = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CART)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Ocurrió un error desconocido al obtener el carrito')
  }
}
```

### 12. Helpers

**Cuándo crear helpers:**

- Funciones puras reutilizables
- Transformaciones de datos
- Cálculos complejos
- Validaciones

**Ejemplo:**

```typescript
// helpers/calculateItemPrice.ts
export const calculateItemPrice = (
  price: number | string,
  discount: number | string,
): number => {
  const numPrice = Number(price)
  const numDiscount = Number(discount)
  return numPrice * (1 - numDiscount / 100)
}
```

### 13. Código Limpio

**Reglas:**

- ✅ Funciones pequeñas y específicas (máximo 50-100 líneas)
- ✅ Archivos no muy extensos (máximo 200-300 líneas)
- ✅ No repetir código (usar helpers, hooks compartidos)
- ✅ Nombres descriptivos y claros
- ✅ Comentarios solo cuando sea necesario explicar "por qué", no "qué"
- ✅ TypeScript estricto (tipos explícitos)

**Ejemplo de código limpio:**

```typescript
// ✅ BIEN - Código claro y conciso
const total = useMemo(() => {
  return items.reduce((sum, item) => {
    const finalPrice = calculateItemPrice(item.price, item.discount)
    return sum + finalPrice * item.quantity
  }, 0)
}, [items])

// ❌ MAL - Código repetitivo y largo
const total = useMemo(() => {
  let sum = 0
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const price = Number(item.price)
    const discount = Number(item.discount)
    const finalPrice = price * (1 - discount / 100)
    sum = sum + finalPrice * item.quantity
  }
  return sum
}, [items])
```

### 14. Sincronización de Estado

**Patrón para sincronizar estado local con servidor:**

```typescript
// hooks/useCartSync.ts
export function useCartSync() {
  const { token } = useAuthStore()
  const { items: localItems, clearCart } = useCartStore()
  const queryClient = useQueryClient()

  const { data: dbItems } = useCartQuery({
    enabled: !!token,
  })

  const { mutateAsync: addToCart } = useAddToCartMutation()

  const syncLocalToDB = useCallback(async () => {
    if (localItems.length === 0) return

    // Sincronizar sin duplicar
    for (const localItem of localItems) {
      const exists = dbItems?.find(
        (item) => item.productId === localItem.productId,
      )
      if (exists) {
        await updateCartItem({
          id: exists.id,
          quantity: exists.quantity + localItem.quantity,
        })
      } else {
        await addToCart({
          productId: localItem.productId,
          quantity: localItem.quantity,
        })
      }
    }

    clearCart()
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }, [localItems, dbItems, addToCart, clearCart, queryClient])

  useEffect(() => {
    if (token && localItems.length > 0 && dbItems !== undefined) {
      syncLocalToDB()
    }
  }, [token, localItems.length, dbItems, syncLocalToDB])
}
```

### 15. Uso de sonnerResponse para Notificaciones

**REQUERIMIENTO OBLIGATORIO:**

Las notificaciones al usuario mediante `sonnerResponse` deben estar centralizadas en las mutations para mantener consistencia y evitar duplicación de código.

**Reglas Fundamentales:**

- ✅ **SOLO se usa en mutations** (create, update, delete)
- ✅ **NO se usa en componentes, modales, hooks, servicios, stores o queries**
- ✅ Debe importarse desde `@/app/helpers/sonnerResponse`
- ✅ Debe usarse en `onSuccess` y `onError` de las mutations
- ✅ **NO se usa en mutations de GET/read** (solo create, update, delete)
- ✅ Mensajes deben ser claros y descriptivos

**Estructura Correcta:**

```typescript
// ✅ CORRECTO - En mutation
// mutations/useCreateProductMutation.ts
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProductService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      sonnerResponse('Producto creado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al crear el producto'
      sonnerResponse(message, 'error')
    },
  })
}
```

**Ejemplos de Uso Incorrecto:**

```typescript
// ❌ INCORRECTO - En componente
// components/ProductCard.tsx
import { sonnerResponse } from '@/app/helpers/sonnerResponse' // ❌ NO

const handleAdd = async () => {
  await addToCart(...)
  sonnerResponse('Producto agregado', 'success') // ❌ NO
}
```

```typescript
// ❌ INCORRECTO - En hook
// hooks/useProductHook.ts
import { sonnerResponse } from '@/app/helpers/sonnerResponse' // ❌ NO

const handleSubmit = async () => {
  await createProduct(...)
  sonnerResponse('Creado', 'success') // ❌ NO
}
```

```typescript
// ❌ INCORRECTO - En servicio
// services/createProductService.ts
import { sonnerResponse } from '@/app/helpers/sonnerResponse' // ❌ NO

export const createProductService = async (data) => {
  const response = await axiosInstance.post(...)
  sonnerResponse('Creado', 'success') // ❌ NO
  return response.data
}
```

**Casos Especiales:**

1. **Carrito Local (localStorage):**
   - Si una acción no pasa por mutation (ej: agregar al carrito local cuando no hay autenticación), se puede usar `sonnerResponse` directamente en el componente
   - Esto es una excepción porque no hay mutation involucrada

2. **Validaciones de Formulario:**
   - Las validaciones locales de formulario pueden mostrar errores, pero preferiblemente usar el sistema de validación del formulario
   - Si se necesita `sonnerResponse` para validaciones, considerar mover la lógica a un helper de validación

**Ventajas de este Patrón:**

- ✅ Centralización de notificaciones
- ✅ Consistencia en mensajes de éxito/error
- ✅ Facilita mantenimiento (un solo lugar para cambiar mensajes)
- ✅ Evita duplicación de código
- ✅ Las mutations son el lugar natural para notificaciones de operaciones CRUD

**Checklist de Verificación:**

- [ ] Todas las mutations de create tienen `sonnerResponse` en `onSuccess` y `onError`
- [ ] Todas las mutations de update tienen `sonnerResponse` en `onSuccess` y `onError`
- [ ] Todas las mutations de delete tienen `sonnerResponse` en `onSuccess` y `onError`
- [ ] No hay `sonnerResponse` en componentes (excepto casos especiales documentados)
- [ ] No hay `sonnerResponse` en hooks
- [ ] No hay `sonnerResponse` en servicios
- [ ] No hay `sonnerResponse` en stores
- [ ] No hay `sonnerResponse` en queries

## 📋 Checklist de Refactorización

Al refactorizar una feature, seguir este checklist:

### Estructura

- [ ] Crear estructura de carpetas según el estándar
- [ ] Mover componentes a `components/`
- [ ] Crear hooks en `hooks/` (máximo 2-3)
- [ ] Organizar queries en `queries/`
- [ ] Organizar mutations en `mutations/`
- [ ] Organizar services en `services/`
- [ ] Crear helpers si es necesario

### Separación de Responsabilidades

- [ ] Mover toda la lógica de componentes a hooks
- [ ] Componentes solo con JSX
- [ ] Hooks sin JSX

### UI Components

- [ ] Reemplazar botones de Ant Design por HeroUI
- [ ] Reemplazar modales de Ant Design por `CustomModalNextUI`
- [ ] Reemplazar tablas de Ant Design por `CustomTableNextUi`
- [ ] Crear modales en `components/modals/`
- [ ] Usar `useDisclosure` de HeroUI para modales

### TanStack Query

- [ ] Usar queries para obtener datos
- [ ] Usar mutations para modificar datos
- [ ] Invalidar queries después de mutations
- [ ] Usar `enabled` para controlar ejecución de queries

### Optimizaciones

- [ ] Eliminar `useEffect` innecesarios
- [ ] Usar `useMemo` para cálculos costosos
- [ ] Usar `useCallback` para funciones pasadas como props
- [ ] Preferir funciones directas sobre `useEffect`

### Estado

- [ ] Usar Zustand para estado global/persistido
- [ ] Usar TanStack Query para estado del servidor
- [ ] Usar `useState` solo para estado local del componente

### Código Limpio

- [ ] Eliminar código duplicado
- [ ] Crear helpers para funciones reutilizables
- [ ] Archivos no muy extensos
- [ ] Nombres descriptivos
- [ ] TypeScript estricto

### Testing

- [ ] Verificar que no hay errores de linting
- [ ] Probar funcionalidad básica
- [ ] Verificar sincronización de estado si aplica

## 🎯 Ejemplo Completo: Feature Cart

La feature `cart` es el ejemplo de referencia. Estructura final:

```
src/app/features/cart/
├── components/
│   ├── CartDrawer.tsx          # Componente drawer (solo JSX)
│   └── modals/
│       └── ClearCartModal.tsx   # Modal de limpiar carrito
├── hooks/
│   ├── useCartDrawerHook.ts     # Lógica del drawer
│   ├── useCartHook.ts           # Lógica del componente Cart
│   └── useCartSync.ts           # Sincronización localStorage ↔ BD
├── mutations/
│   └── useCartMutations.ts      # Mutaciones (add, update, remove, clear)
├── queries/
│   └── useCartQuery.ts          # Query para obtener carrito
├── services/
│   ├── addToCartService.ts
│   ├── clearCartService.ts
│   ├── getCartService.ts
│   ├── removeCartItemService.ts
│   └── updateCartItemService.ts
├── helpers/
│   └── calculateItemPrice.ts   # Helper para calcular precio
└── Cart.tsx                     # Componente principal
```

## 🚀 Proceso de Refactorización

1. **Analizar la feature actual**
   - Identificar componentes
   - Identificar lógica de negocio
   - Identificar llamadas a API
   - Identificar estado global

2. **Crear estructura de carpetas**
   - Seguir el estándar definido
   - Crear carpetas necesarias

3. **Separar lógica de UI**
   - Crear hooks con toda la lógica
   - Limpiar componentes (solo JSX)

4. **Migrar a HeroUI**
   - Reemplazar botones
   - Reemplazar modales
   - Reemplazar tablas

5. **Optimizar**
   - Eliminar `useEffect` innecesarios
   - Usar TanStack Query apropiadamente
   - Crear helpers para código duplicado

6. **Verificar**
   - Linting sin errores
   - Funcionalidad intacta
   - Código más limpio y mantenible

## 📝 Notas Finales

- Este estándar se basa en la refactorización exitosa de la feature `cart`
- Cada feature puede tener variaciones según sus necesidades específicas
- La prioridad es mantener código limpio, mantenible y escalable
- Cuando dudes, consulta la feature `cart` como referencia

---

**Última actualización:** Basado en la refactorización de `cart` feature
**Mantenedor:** Equipo de desarrollo
