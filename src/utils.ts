export const mergeRefs = (...refs:any) => {
    return (node:any) => {
      for (const ref of refs) {
        ref.current = node
      }
    }
  }