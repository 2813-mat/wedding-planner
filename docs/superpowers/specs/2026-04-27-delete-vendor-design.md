# Delete Vendor Feature

**Date:** 2026-04-27

## Overview

Add a delete button (trash icon) next to the edit (pencil) button on each vendor card in the Vendors page. Clicking it opens a confirmation dialog before permanently removing the vendor.

## Components

### New: `DeleteVendorButton`

**File:** `src/components/vendors/DeleteVendorButton.tsx`

- Props: `vendor: Vendor`
- Renders a `Button` (ghost, `h-7 w-7`, `shrink-0`) with `Trash2` icon (`h-3.5 w-3.5`) — same sizing as the edit button
- On click, opens an `AlertDialog` with:
  - **Title:** "Remover fornecedor"
  - **Description:** `Tem certeza que deseja remover "{vendor.name}"? Esta ação não pode ser desfeita.`
  - **Cancel button:** "Cancelar"
  - **Confirm button:** "Remover" (variant `destructive`)
- On confirm: calls `useDeleteVendor().mutateAsync(vendor.id)`, shows success or error toast
- Button is disabled while mutation is pending

### Modified: `VendorsPage.tsx`

- Import `DeleteVendorButton`
- Add `<DeleteVendorButton vendor={vendor} />` immediately after `<EditVendorModal vendor={vendor} />` inside the card header action row

## Data Flow

1. User clicks trash icon → AlertDialog opens (no API call yet)
2. User clicks "Remover" → `vendorService.delete(id)` called via `useDeleteVendor`
3. On success → `vendors` query invalidated, list updates, success toast shown
4. On error → error toast shown

## Error Handling

- Toast `destructive` on API failure: "Não foi possível remover o fornecedor."
- Button disabled during pending mutation to prevent double-click

## Dependencies

- `useDeleteVendor` from `../../hooks/useVendors` (already exists)
- `AlertDialog` components from `../ui/alert-dialog` (already exists)
- `Trash2`, `Loader` from `lucide-react`
- `toast` from `../ui/use-toast`
