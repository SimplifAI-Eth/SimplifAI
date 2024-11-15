export const ERC20ABI = [
    {
      type: 'function',
      name: 'name',
      stateMutability: 'view',
      inputs: [],
      outputs: [{name: "", type: "string"}],
    },
    {
      type: 'function',
      name: 'symbol',
      stateMutability: 'view',
      inputs: [],
      outputs: [{name: "", type: "string"}],
    }
  ] as const