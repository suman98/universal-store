# Table Components Structure

This directory contains atomic components following the Atomic Design methodology. Each file contains a single, focused component.

## Directory Structure

```
components/
├── index.ts                    # Central export file for all components
├── types.ts                    # Shared TypeScript interfaces
├── utils.ts                    # Utility functions for data transformation
│
├── InputField.tsx              # Atom: Single input field component
├── EmptyState.tsx              # Atom: Empty state display
├── TableCell.tsx               # Atom: Single table cell
├── AddRowButton.tsx            # Atom: Add row button
├── RowCounter.tsx              # Atom: Row count display
│
├── PageHeader.tsx              # Molecule: Page header with navigation
├── PageContainer.tsx           # Molecule: Main page wrapper
├── ContentContainer.tsx        # Molecule: Content area wrapper
├── TableRow.tsx                # Molecule: Complete table row with actions
│
├── NewRowForm.tsx              # Organism: Form for adding new rows
├── EditModal.tsx               # Organism: Modal for editing rows
└── DataTable.tsx               # Organism: Complete data table
```

## Component Hierarchy

### Atoms (Smallest, Reusable)
- **InputField**: Generic input field that handles different types (text, number, date, boolean)
- **EmptyState**: Display when no data exists
- **TableCell**: Individual table cell
- **AddRowButton**: Button to trigger add row form
- **RowCounter**: Displays total row count

### Molecules (Combinations)
- **PageHeader**: Header with title, description, and navigation buttons
- **PageContainer**: Main layout wrapper with gradient background
- **ContentContainer**: Content area with padding and max-width
- **TableRow**: Complete row with cells and action buttons (Edit/Delete)

### Organisms (Complex)
- **NewRowForm**: Form with multiple InputFields for adding new rows
- **EditModal**: Modal dialog for editing a row with form fields
- **DataTable**: Complete table with header, rows, and empty state

### Container Pages
- **Show**: Main page component that orchestrates all components and state management

## Utilities

### `utils.ts`
- `getCellValue()`: Extracts and formats cell values based on column type
- `getEditDataFromRow()`: Transforms row data for editing
- `transformFlatDataToNested()`: Converts flat edit data to nested backend structure

### `types.ts`
Defines shared TypeScript interfaces:
- `Column`: Column definition with type and display info
- `CellValue`: Individual cell data
- `Row`: Complete row with all cell values
- `Table`: Table metadata

## Usage Example

```tsx
import { PageHeader, DataTable, EditModal } from './components';

// Components expect data and callbacks as props
// No internal state management - managed by parent
```

## Benefits

1. **Single Responsibility**: Each component does one thing well
2. **Reusability**: Atoms can be reused in different contexts  
3. **Testability**: Small, focused components are easier to test
4. **Maintainability**: Clear separation of concerns
5. **Scalability**: Easy to add new components or variations
6. **Documentation**: Self-documenting through file names and structure
