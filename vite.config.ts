import { resolve } from 'path';
import { defineConfig, UserConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import stylelint from 'vite-plugin-stylelint';

const config = defineConfig(({ command }) => {
    const userConfig: UserConfig = {
        publicDir: resolve(import.meta.dirname, 'public'),
        base: './',
        plugins: [
            dts(),
            tsconfigPaths(),
            eslint({
                cache: false,
                fix: true,
                lintOnStart: true,
                include: ['src/**/*.{js, jsx, ts, tsx, cjs, mjs}'],
            }),
            stylelint({
                cacheLocation: 'node_modules/.cache/stylelint/.stylelintcache',
                fix: true,
                cache: false,
                lintOnStart: true,
                include: ['src/**/*.{css,scss,sass,less,styl,vue,svelte}'],
            }),
            checker({
                typescript: true,
            }),
        ],
        css: {
            devSourcemap: true,
        },
        build: {
            target: 'es2017',
            outDir: resolve(import.meta.dirname, 'build'),
            emptyOutDir: true,
            sourcemap: true,
            minify: true,
        },
    };
    if (command === 'serve') {
        return userConfig;
    }
    if (command === 'build') {
        userConfig.esbuild = {
            drop: ['console', 'debugger'],
        };
        return userConfig;
    }
    return userConfig;
});

export default config;
