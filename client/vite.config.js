import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js'
//         }
//     }
// })