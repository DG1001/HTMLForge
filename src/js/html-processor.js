// HTMLProcessor class for SEARCH/REPLACE functionality
class HTMLProcessor {
    constructor() {
        this.searchReplaceBlocks = [];
    }

    parseSearchReplaceBlocks(content) {
        const blocks = [];
        const searchPattern = /<<<<<<< SEARCH\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> REPLACE/g;
        let match;

        while ((match = searchPattern.exec(content)) !== null) {
            blocks.push({
                search: match[1],
                replace: match[2]
            });
        }

        this.searchReplaceBlocks = blocks;
        return blocks;
    }

    applyChanges(originalHtml, blocks) {
        let modifiedHtml = originalHtml;
        let appliedChanges = 0;

        for (const block of blocks) {
            const searchText = block.search;
            const replaceText = block.replace;

            if (modifiedHtml.includes(searchText)) {
                modifiedHtml = modifiedHtml.replace(searchText, replaceText);
                appliedChanges++;
            }
        }

        return {
            html: modifiedHtml,
            appliedChanges: appliedChanges,
            totalBlocks: blocks.length
        };
    }

    displaySearchReplaceBlocks(blocks) {
        const container = document.getElementById('streamOutput');
        container.innerHTML = '';

        blocks.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.className = 'search-replace-block';
            blockElement.innerHTML = `
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Change ${index + 1}</h4>
                <div class="space-y-2">
                    <div>
                        <span class="text-sm font-medium text-red-600 dark:text-red-400">SEARCH:</span>
                        <pre class="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm overflow-x-auto"><code>${this.escapeHtml(block.search)}</code></pre>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-green-600 dark:text-green-400">REPLACE:</span>
                        <pre class="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm overflow-x-auto"><code>${this.escapeHtml(block.replace)}</code></pre>
                    </div>
                </div>
            `;
            container.appendChild(blockElement);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}