import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import svelteConfig from './svelte.config.js';

export default {
    input: 'main.ts',
    output: {
        file: 'main.js',
        format: 'cjs'
    },
    external: [
        "obsidian",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
    ],
    plugins: [
        typescript(),
        svelte(svelteConfig),
        css(),
        resolve({
            browser: true,
            exportConditions: ['svelte'],
            extensions: ['.svelte']
        })
    ]
}