import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    /*
    proxy: {
      '/':{
          target:'http://172.17.0.4:5000/capstone',
          changeOrigin:true, 
          rewrite:(path) => path.replace(/^\/capstone/,'')
      },
      */
  },
//  base:'/capstone',
  plugins: [react()],
})

//Proxy 

