/**
 * Utility to help debug infinite render loops
 * Add this to your component to log when it renders and what dependencies changed
 */
export function debugRender(componentName: string, dependencies: Record<string, any>) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${componentName}] rendered`)

    // Log all dependencies
    Object.entries(dependencies).forEach(([key, value]) => {
      console.log(`[${componentName}] dependency "${key}":`, value)
    })
  }
}
