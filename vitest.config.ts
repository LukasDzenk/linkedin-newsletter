import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@configs': resolve(__dirname, './src/lib/configs'),
            '@constants': resolve(__dirname, './src/lib/constants'),
            '@errors': resolve(__dirname, './src/lib/errors'),
            '@logger': resolve(__dirname, './src/lib/logger'),
            '@utils': resolve(__dirname, './src/lib/utils'),
            '@vendors': resolve(__dirname, './src/lib/vendors'),
            '@schemas': resolve(__dirname, './src/lib/schemas'),
            '@middleware': resolve(__dirname, './src/middleware'),
            '@modules': resolve(__dirname, './src/modules'),
        },
    },
})
