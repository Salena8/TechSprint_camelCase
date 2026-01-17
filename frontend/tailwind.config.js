module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9E6',
        pastelPink: '#FFD7E2',
        pastelGreen: '#D6F7E4',
        pastelYellow: '#FFF4C2',
        pastelBlue: '#D9EEFF',
        pastelPurple: '#E9D8FF',
        pastelRed: '#FDEAEA',
        softBlue: '#2563EB',
        softGreen: '#16A34A',
        softYellow: '#D97706',
        softRed: '#DC2626',
        cardGlow: 'rgba(0, 0, 0, 0.03)',
        primaryText: '#233240'
      },
      borderRadius: {
        'xl-2': '20px'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(35,50,64,0.06)'
      }
    }
  },
  plugins: []
}


