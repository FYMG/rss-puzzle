const config = {
    '*.{js, jsx, ts, tsx, cjs, mjs}': filenames => {
        return `eslint ${filenames.join(' ')} --fix`;
    },
    '*.{json, html}': filenames => {
        return `prettier ${filenames.join(' ')} --write --ignore-path .gitignore`;
    },
    '*.{css,scss,sass,less,styl,vue,svelte}': filenames => {
        return `stylelint ${filenames.join(' ')} --fix`;
    },
};

export default config;
