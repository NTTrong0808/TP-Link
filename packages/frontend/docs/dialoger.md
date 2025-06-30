# Dialoger Component Documentation

## Overview

The `@dialoger` is a flexible dialog/modal management system that provides a hook-based approach to handle dialogs in your React application. It allows for dynamic dialog creation and management without cluttering your component tree.

## Installation

The component is available in the project's internal components:

```typescript
import { useDialoger } from "@/components/widgets/dialoger";
```

## Basic Usage

### 1. Import the Hook

```typescript
import { useDialoger } from "@/components/widgets/dialoger";
```

### 2. Initialize the Hook

```typescript
const { addDialoger } = useDialoger();
```

### 3. Create a Dialog

```typescript
addDialoger({
  variant: "dialog",
  content: (
    <YourDialogContent />
  ),
});
```

## Example Implementation

Here's a complete example showing how to use the dialoger in a form component:

```typescript
import { useDialoger } from "@/components/widgets/dialoger";

const YourComponent = () => {
  const { addDialoger } = useDialoger();

  const handleAction = () => {
    addDialoger({
      variant: "dialog",
      content: (
        <ConfirmationDialog
          onConfirm={() => {
            // Handle confirmation
          }}
        />
      ),
    });
  };

  return (
    <button onClick={handleAction}>
      Open Dialog
    </button>
  );
};
```

## API Reference

### useDialoger Hook

The main hook for managing dialogs.

#### Returns

- `addDialoger`: Function to create and show a new dialog
- `removeDialoger`: Function to remove a specific dialog
- `removeAllDialoger`: Function to remove all active dialogs

### DialogerOptions

```typescript
interface DialogerOptions {
  variant: "dialog" | "drawer" | "modal"; // Type of dialog to display
  content: ReactNode; // Content to render inside the dialog
  onClose?: () => void; // Optional callback when dialog closes
  // Additional configuration options can be added based on variant
}
```

## Advantages

1. **Centralized Management**

   - Single source of truth for all dialogs
   - Easy to manage multiple dialogs
   - Consistent dialog behavior across the application

2. **Declarative API**

   - Simple hook-based API
   - Clean component code
   - Reduced boilerplate

3. **Flexibility**

   - Supports different types of dialogs (modal, drawer, etc.)
   - Customizable content
   - Easy to extend

4. **Type Safety**
   - Full TypeScript support
   - Predictable API

## Disadvantages

1. **Global State**

   - Uses global state management which might be overkill for simple use cases
   - Potential for naming conflicts if not managed properly

2. **Learning Curve**

   - New pattern to learn for team members
   - Requires understanding of React hooks and context

3. **Bundle Size**
   - Adds to the overall bundle size
   - Might be unnecessary for very simple applications

## Best Practices

1. **Component Organization**

   ```typescript
   // Separate dialog content into its own component
   const ConfirmationDialog = ({ onConfirm }) => {
     return (
       <div>
         <h2>Confirm Action</h2>
         <button onClick={onConfirm}>Confirm</button>
       </div>
     );
   };
   ```

2. **Error Handling**

   ```typescript
   const handleDialogAction = () => {
     try {
       addDialoger({
         variant: "dialog",
         content: <DialogContent />,
       });
     } catch (error) {
       console.error("Failed to show dialog:", error);
     }
   };
   ```

3. **Cleanup**
   ```typescript
   useEffect(() => {
     return () => {
       // Clean up any remaining dialogs when component unmounts
       removeAllDialoger();
     };
   }, []);
   ```

## Common Use Cases

1. **Confirmation Dialogs**

   ```typescript
   addDialoger({
     variant: "dialog",
     content: (
       <ConfirmationDialog
         onConfirm={handleConfirm}
         onCancel={handleCancel}
       />
     ),
   });
   ```

2. **Form Dialogs**

   ```typescript
   addDialoger({
     variant: "dialog",
     content: (
       <FormDialog
         onSubmit={handleSubmit}
         initialData={data}
       />
     ),
   });
   ```

3. **Information Dialogs**
   ```typescript
   addDialoger({
     variant: "dialog",
     content: (
       <InfoDialog
         title="Information"
         message="Operation completed successfully"
       />
     ),
   });
   ```

## Troubleshooting

### Common Issues

1. **Dialog Not Showing**

   - Ensure useDialoger is called within a DialogProvider
   - Check if the content is valid React elements

2. **Multiple Dialogs Conflict**

   - Use unique identifiers for different dialogs
   - Manage dialog stack properly

3. **Performance Issues**
   - Avoid creating new content components on every render
   - Memoize dialog content when appropriate

## Contributing

When extending or modifying the dialoger component:

1. Follow the existing pattern
2. Add proper TypeScript types
3. Document new features or changes
4. Add unit tests for new functionality

This documentation should be placed in your project's `docs/components/dialoger.md` file for easy reference.
