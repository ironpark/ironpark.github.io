import { visit } from 'unist-util-visit';

/**
 * Remark plugin to automatically add CodeBlock import to markdown files
 * that contain code blocks but don't already have a script tag
 */
export function remarkAutoImportCodeBlock() {
    return (tree, file) => {
        let hasCodeBlock = false;
        let hasScriptTag = false;
        let scriptNodeIndex = -1;

        // Check if there are any code blocks in the document
        visit(tree, 'code', () => {
            hasCodeBlock = true;
        });

        // Check if there's already a script tag
        visit(tree, 'html', (node, index) => {
            if (node.value && node.value.includes('<script')) {
                hasScriptTag = true;
                scriptNodeIndex = index;
            }
        });

        // If there are code blocks but no script tag, add the import
        if (hasCodeBlock && !hasScriptTag) {
            const importScript = {
                type: 'html',
                value: '<script>\n    import CodeBlock from "$lib/components/CodeBlock.svelte";\n</script>'
            };

            // Add at the beginning of the document
            tree.children.unshift(importScript);
        }
        // If there's a script tag, check if it already has the import
        else if (hasCodeBlock && hasScriptTag && scriptNodeIndex !== -1) {
            const scriptNode = tree.children[scriptNodeIndex];
            const hasImport = scriptNode.value.includes('CodeBlock');
            
            // If no CodeBlock import exists, add it to the existing script tag
            if (!hasImport) {
                scriptNode.value = scriptNode.value.replace(
                    '<script>',
                    '<script>\n    import CodeBlock from "$lib/components/CodeBlock.svelte";'
                );
            }
        }
    };
}