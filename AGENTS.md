# Instructions for AI Agents

## Core Rules

**CRITICALLY IMPORTANT**: Maximum TypeScript typing required.

### Mandatory:

1. **Typing**
    - Never use `any`
    - Always define interfaces for objects
    - Use generic types where appropriate
    - Explicitly specify function return types
    - Type all function parameters
    - Use union types for limited values

2. **Redux**
    - Use only typed hooks: `useAppDispatch`, `useAppSelector`
    - All slices must have typed state
    - All actions must have typed payload (`PayloadAction<T>`)

3. **React**
    - Always type props through interfaces
    - Use `React.ReactNode` for children
    - Type event handlers

4. **Code Quality**
    - **FORBIDDEN** to add comments in code
    - Code must be self-documenting through proper naming
    - Use TypeScript utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`)

5. **File Optimization**
    - Keep this file concise and focused
    - Remove unnecessary examples or explanations
    - Focus only on essential coding rules
