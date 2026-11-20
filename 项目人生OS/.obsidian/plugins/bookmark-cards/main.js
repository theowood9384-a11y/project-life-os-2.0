const { Plugin, ItemView, setIcon, requestUrl, Notice, PluginSettingTab, Setting } = require('obsidian');

const VIEW_TYPE_BOOKMARK_CARDS = 'bookmark-cards-view';

// ===== 项目人生 · 数据格式规范 v1.0 §7（见 00-后台/数据格式规范.md）=====
const PL_INBOX_SECTION = '📥 待整理';
// 显示标题：md 里写的标题优先；只有裸链接（标题就是网址）时才用抓取到的网页标题
function plTitle(item, meta) {
    const name = item.name || '';
    return name && name !== item.url ? name : ((meta && meta.title) || name);
}
// 显示描述：md 里写的描述优先，其次是旧版存在 data.json 的自定义描述，最后才是抓取的网页简介
function plDesc(item, meta) {
    meta = meta || {};
    return item.description || meta.customDescription || meta.description || '';
}
// 文件里第一个「## 分类」之前的内容（frontmatter、一级标题、说明文字）原样保留
function plPreamble(content) {
    const lines = String(content || '').split('\n');
    let inFm = lines[0] === '---';
    for (let i = 0; i < lines.length; i++) {
        if (inFm) { if (i > 0 && lines[i] === '---') inFm = false; continue; }
        if (/^#{2,}\s/.test(lines[i])) return lines.slice(0, i).join('\n');
    }
    return lines.join('\n');
}

// High-quality SVG Default Cover (Dark Theme)
const DEFAULT_COVER_SVG = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%232d333b;stop-opacity:1" /><stop offset="100%" style="stop-color:%231e2329;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="45%" font-family="sans-serif" font-weight="bold" font-size="48" fill="%23adbac7" text-anchor="middle">Obsidian</text><text x="50%" y="60%" font-family="sans-serif" font-size="24" fill="%23768390" text-anchor="middle">Bookmark Card</text></svg>`;

const DEFAULT_SETTINGS = {
    metadata: {},
    linkStatus: {}, // 存储链接可用性状态: { url: { status: 'valid'|'invalid'|'unknown', lastCheck: timestamp } }
    defaultImage: DEFAULT_COVER_SVG,
    enableList: true,
    enableGrid: true,
    enableTable: true, // 表格视图
    bookmarkFilePath: 'Example/Path/To/Your/Bookmarks.md',
    // Screenshot API settings
    screenshotApi: 'none',  // Options: 'none', 'microlink', 'pagepeeker', 'thum', 'screenshotmachine', 'custom'
    screenshotApiKey: '',   // For APIs that require a key
    customScreenshotApi: '', // Custom API URL template with {url} placeholder
    // Link validation settings
    enableLinkValidation: true, // 是否启用链接检测
    linkCheckInterval: 7, // 链接检测间隔（天）
    // Tag settings - 标签设置
    enableTags: true, // 是否启用标签功能
    tagDisplayMode: 'card', // 标签显示模式: 'card' 卡片上显示, 'filter' 仅筛选, 'both' 两者都有
    tagColors: {}, // 自定义标签颜色 { tagName: colorHex }
    // Table view settings - 表格视图设置
    tableSortColumn: 'title', // 默认排序列
    tableSortDirection: 'asc' // 排序方向: 'asc' | 'desc'
};

class BookmarkCardsView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.data = [];
        this.currentView = 'list';
        // 搜索与过滤状态
        this.searchQuery = '';
        this.selectedCategory = ''; // 空字符串表示"全部"
        this.categories = []; // 存储所有分类
        // 标签相关状态
        this.allTags = []; // 存储所有标签
        this.selectedTags = []; // 当前选中的标签（支持多选）
        // 表格视图状态
        this.tableSortColumn = 'title';
        this.tableSortDirection = 'asc';
        // 拖拽相关状态
        this.draggedItem = null;
        this.draggedElement = null;
        this.dragSourceCategory = null;
        this.dropIndicator = null;
        // 链接检测状态
        this.isCheckingLinks = false;
        this.linkCheckQueue = [];
    }

    getViewType() {
        return VIEW_TYPE_BOOKMARK_CARDS;
    }

    getDisplayText() {
        return '书签收藏盒';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('clean-cards-view');

        // Ensure valid view based on settings
        if (this.plugin.settings.enableList && !this.plugin.settings.enableGrid) {
            this.currentView = 'list';
        } else if (!this.plugin.settings.enableList && this.plugin.settings.enableGrid) {
            this.currentView = 'grid';
        }

        this.loadAndRender(container);
        this.registerEvent(this.app.vault.on('modify', (file) => {
            if (file.path === this.plugin.settings.bookmarkFilePath) {
                this.loadAndRender(container);
            }
        }));
    }

    async loadAndRender(container) {
        container.empty();

        // --- Action Bar ---
        const actions = container.createDiv({ cls: 'clean-cards-actions' });

        // Left: View Switcher
        const viewGroup = actions.createDiv({ cls: 'view-actions-group' });

        if (this.plugin.settings.enableList) {
            const listBtn = viewGroup.createEl('button', { cls: 'action-btn' });
            setIcon(listBtn, 'list');
            listBtn.setAttribute('aria-label', '切换列表视图');
            if (this.currentView === 'list') listBtn.addClass('is-active');
            listBtn.onclick = () => {
                this.currentView = 'list';
                this.loadAndRender(container);
            };
        }

        if (this.plugin.settings.enableGrid) {
            const gridBtn = viewGroup.createEl('button', { cls: 'action-btn' });
            setIcon(gridBtn, 'layout-grid');
            gridBtn.setAttribute('aria-label', '切换卡片视图');
            if (this.currentView === 'grid') gridBtn.addClass('is-active');
            gridBtn.onclick = () => {
                this.currentView = 'grid';
                this.loadAndRender(container);
            };
        }

        if (this.plugin.settings.enableTable) {
            const tableBtn = viewGroup.createEl('button', { cls: 'action-btn' });
            setIcon(tableBtn, 'table');
            tableBtn.setAttribute('aria-label', '切换表格视图');
            if (this.currentView === 'table') tableBtn.addClass('is-active');
            tableBtn.onclick = () => {
                this.currentView = 'table';
                this.loadAndRender(container);
            };
        }

        const refreshBtn = viewGroup.createEl('button', { cls: 'action-btn' });
        setIcon(refreshBtn, 'refresh-cw');
        refreshBtn.setAttribute('aria-label', '刷新数据');
        refreshBtn.onclick = async () => {
            new Notice("🔄 正在刷新元数据...");
            await this.refreshAllMetadata();
            this.loadAndRender(container);
            new Notice("✅ 刷新完成！");
        };

        // 链接检测按钮
        if (this.plugin.settings.enableLinkValidation) {
            const checkLinksBtn = viewGroup.createEl('button', { cls: 'action-btn' });
            setIcon(checkLinksBtn, 'shield-check');
            checkLinksBtn.setAttribute('aria-label', '检测失效链接');
            
            // 显示失效链接数量徽章
            const invalidCount = this.getInvalidLinkCount();
            if (invalidCount > 0) {
                const badge = checkLinksBtn.createSpan({ cls: 'invalid-badge' });
                badge.textContent = invalidCount > 99 ? '99+' : invalidCount;
            }
            
            checkLinksBtn.onclick = async () => {
                if (this.isCheckingLinks) {
                    new Notice("⏳ 链接检测正在进行中...");
                    return;
                }
                await this.checkAllLinks(container);
            };
        }

        // Right: Source Button
        const editBtn = actions.createEl('button', { cls: 'action-btn' });
        setIcon(editBtn, 'file-text');
        editBtn.setAttribute('aria-label', '查看数据源');
        editBtn.onclick = async () => {
            const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.bookmarkFilePath);
            if (file) {
                this.app.workspace.getLeaf().openFile(file);
            } else {
                new Notice(`未找到文件: ${this.plugin.settings.bookmarkFilePath}，请检查设置`);
            }
        };

        // --- Load Data ---
        await this.loadFile();

        // --- 搜索与过滤栏 ---
        const filterBar = container.createDiv({ cls: 'filter-bar' });
        
        // 搜索框容器
        const searchContainer = filterBar.createDiv({ cls: 'search-container' });
        const searchIcon = searchContainer.createSpan({ cls: 'search-icon' });
        setIcon(searchIcon, 'search');
        
        const searchInput = searchContainer.createEl('input', {
            cls: 'search-input',
            type: 'text',
            placeholder: ''
        });
        searchInput.value = this.searchQuery;
        
        // 清除搜索按钮
        const clearBtn = searchContainer.createSpan({ cls: 'search-clear' });
        setIcon(clearBtn, 'x');
        clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
        clearBtn.onclick = () => {
            this.searchQuery = '';
            searchInput.value = '';
            clearBtn.style.display = 'none';
            this.renderContent(contentContainer);
        };

        // 搜索输入事件（防抖）
        let debounceTimer;
        searchInput.oninput = (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchQuery = e.target.value.trim().toLowerCase();
                clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                this.renderContent(contentContainer);
            }, 200);
        };

        // 键盘事件
        searchInput.onkeydown = (e) => {
            if (e.key === 'Escape') {
                this.searchQuery = '';
                searchInput.value = '';
                clearBtn.style.display = 'none';
                this.renderContent(contentContainer);
            }
        };

        // 提取所有分类
        this.extractCategories(this.data);
        // 提取所有标签
        this.extractAllTags(this.data);

        // 分类筛选下拉框
        if (this.categories.length > 0) {
            const categoryContainer = filterBar.createDiv({ cls: 'category-filter-container' });
            const categoryIcon = categoryContainer.createSpan({ cls: 'category-icon' });
            setIcon(categoryIcon, 'folder');
            
            const categorySelect = categoryContainer.createEl('select', { cls: 'category-select' });
            
            // 添加"全部"选项
            const allOption = categorySelect.createEl('option', { 
                value: '', 
                text: `全部分类 (${this.countAllBookmarks(this.data)})`
            });
            
            // 添加各分类选项
            this.categories.forEach(cat => {
                const option = categorySelect.createEl('option', { 
                    value: cat.name, 
                    text: `${cat.name} (${cat.count})`
                });
                if (this.selectedCategory === cat.name) {
                    option.selected = true;
                }
            });

            categorySelect.onchange = (e) => {
                this.selectedCategory = e.target.value;
                this.renderContent(contentContainer);
            };
        }

        // 标签筛选器
        if (this.plugin.settings.enableTags && this.allTags.length > 0) {
            const tagFilterContainer = filterBar.createDiv({ cls: 'tag-filter-container' });
            
            // 标签图标和下拉按钮
            const tagToggleBtn = tagFilterContainer.createDiv({ cls: 'tag-toggle-btn' });
            const tagIcon = tagToggleBtn.createSpan({ cls: 'tag-icon' });
            setIcon(tagIcon, 'hash');
            tagToggleBtn.createSpan({ cls: 'tag-toggle-text', text: '标签' });
            
            // 显示已选标签数量
            if (this.selectedTags.length > 0) {
                const selectedBadge = tagToggleBtn.createSpan({ cls: 'tag-selected-badge' });
                selectedBadge.textContent = this.selectedTags.length;
            }
            
            const chevron = tagToggleBtn.createSpan({ cls: 'tag-chevron' });
            setIcon(chevron, 'chevron-down');
            
            // 标签下拉面板
            const tagDropdown = tagFilterContainer.createDiv({ cls: 'tag-dropdown' });
            tagDropdown.style.display = 'none';
            
            // 标签搜索框
            const tagSearchContainer = tagDropdown.createDiv({ cls: 'tag-search-container' });
            const tagSearchInput = tagSearchContainer.createEl('input', {
                cls: 'tag-search-input',
                type: 'text',
                placeholder: '搜索标签...'
            });
            
            // 已选标签显示区
            const selectedTagsContainer = tagDropdown.createDiv({ cls: 'selected-tags-container' });
            
            // 标签列表容器
            const tagListContainer = tagDropdown.createDiv({ cls: 'tag-list-container' });
            
            // 渲染标签列表的函数
            const renderTagList = (filter = '') => {
                tagListContainer.empty();
                selectedTagsContainer.empty();
                
                // 显示已选标签
                if (this.selectedTags.length > 0) {
                    selectedTagsContainer.style.display = 'flex';
                    this.selectedTags.forEach(tagName => {
                        const selectedTag = selectedTagsContainer.createDiv({ cls: 'selected-tag-chip' });
                        selectedTag.createSpan({ text: `#${tagName}` });
                        const removeBtn = selectedTag.createSpan({ cls: 'selected-tag-remove' });
                        setIcon(removeBtn, 'x');
                        removeBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.selectedTags = this.selectedTags.filter(t => t !== tagName);
                            renderTagList(tagSearchInput.value);
                            this.renderContent(contentContainer);
                            // 更新徽章
                            this.loadAndRender(container);
                        };
                    });
                    
                    // 清空所有按钮
                    if (this.selectedTags.length > 1) {
                        const clearAllBtn = selectedTagsContainer.createDiv({ cls: 'clear-all-tags-btn' });
                        clearAllBtn.textContent = '清空';
                        clearAllBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.selectedTags = [];
                            renderTagList(tagSearchInput.value);
                            this.renderContent(contentContainer);
                            this.loadAndRender(container);
                        };
                    }
                } else {
                    selectedTagsContainer.style.display = 'none';
                }
                
                // 过滤并显示标签列表
                const filteredTags = this.allTags.filter(tag => 
                    tag.name.toLowerCase().includes(filter.toLowerCase())
                );
                
                if (filteredTags.length === 0) {
                    tagListContainer.createDiv({ cls: 'tag-list-empty', text: '没有找到标签' });
                    return;
                }
                
                filteredTags.forEach(tag => {
                    const tagItem = tagListContainer.createDiv({ cls: 'tag-list-item' });
                    const isSelected = this.selectedTags.includes(tag.name);
                    if (isSelected) {
                        tagItem.addClass('is-selected');
                    }
                    
                    const checkbox = tagItem.createDiv({ cls: 'tag-checkbox' });
                    if (isSelected) {
                        setIcon(checkbox, 'check');
                    }
                    
                    const tagNameSpan = tagItem.createSpan({ cls: 'tag-name', text: `#${tag.name}` });
                    const tagCountSpan = tagItem.createSpan({ cls: 'tag-count', text: `${tag.count}` });
                    
                    tagItem.onclick = () => {
                        if (isSelected) {
                            this.selectedTags = this.selectedTags.filter(t => t !== tag.name);
                        } else {
                            this.selectedTags.push(tag.name);
                        }
                        renderTagList(tagSearchInput.value);
                        this.renderContent(contentContainer);
                    };
                });
            };
            
            // 初始渲染
            renderTagList();
            
            // 标签搜索
            tagSearchInput.oninput = (e) => {
                renderTagList(e.target.value);
            };
            
            // 点击切换下拉面板
            tagToggleBtn.onclick = (e) => {
                e.stopPropagation();
                const isVisible = tagDropdown.style.display !== 'none';
                tagDropdown.style.display = isVisible ? 'none' : 'block';
                chevron.empty();
                setIcon(chevron, isVisible ? 'chevron-down' : 'chevron-up');
                if (!isVisible) {
                    tagSearchInput.focus();
                }
            };
            
            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (!tagFilterContainer.contains(e.target)) {
                    tagDropdown.style.display = 'none';
                    chevron.empty();
                    setIcon(chevron, 'chevron-down');
                }
            });
        }

        // 显示搜索结果统计
        const statsContainer = filterBar.createDiv({ cls: 'filter-stats' });
        this.statsContainer = statsContainer;

        // --- Content ---
        const contentContainer = container.createDiv({ cls: 'cards-content-container' });
        this.renderContent(contentContainer);
    }

    /**
     * 渲染内容（根据搜索和过滤条件）
     */
    renderContent(contentContainer) {
        contentContainer.empty();

        // 获取过滤后的数据
        const filteredData = this.getFilteredData();
        
        // 更新统计信息
        this.updateStats(filteredData);

        // Fallback logic if current view is disabled
        let viewToRender = this.currentView;
        if (viewToRender === 'list' && !this.plugin.settings.enableList) {
            viewToRender = this.plugin.settings.enableGrid ? 'grid' : 
                           this.plugin.settings.enableTable ? 'table' : 'list';
        }
        if (viewToRender === 'grid' && !this.plugin.settings.enableGrid) {
            viewToRender = this.plugin.settings.enableList ? 'list' : 
                           this.plugin.settings.enableTable ? 'table' : 'grid';
        }
        if (viewToRender === 'table' && !this.plugin.settings.enableTable) {
            viewToRender = this.plugin.settings.enableList ? 'list' : 
                           this.plugin.settings.enableGrid ? 'grid' : 'table';
        }

        if (filteredData.length === 0 && (this.searchQuery || this.selectedCategory || this.selectedTags.length > 0)) {
            // 无搜索结果
            const emptyState = contentContainer.createDiv({ cls: 'empty-state' });
            const emptyIcon = emptyState.createDiv({ cls: 'empty-icon' });
            setIcon(emptyIcon, 'search-x');
            emptyState.createDiv({ cls: 'empty-text', text: '没有找到匹配的书签' });
            if (this.searchQuery) {
                emptyState.createDiv({ cls: 'empty-hint', text: `搜索: "${this.searchQuery}"` });
            }
            return;
        }

        if (viewToRender === 'list') {
            this.renderTree(contentContainer, filteredData);
        } else if (viewToRender === 'grid') {
            this.renderGrid(contentContainer, filteredData);
        } else if (viewToRender === 'table') {
            this.renderTable(contentContainer, filteredData);
        } else {
            contentContainer.createDiv({ text: "请在设置中至少开启一种视图模式" });
        }
    }

    /**
     * 提取所有分类
     */
    extractCategories(items, categories = []) {
        items.forEach(item => {
            if (item.type === 'folder') {
                const count = this.countBookmarksInFolder(item);
                if (count > 0) {
                    categories.push({ name: item.name, count: count });
                }
                // 不递归提取子分类，只取顶级分类
            }
        });
        this.categories = categories;
    }

    /**
     * 提取所有标签
     */
    extractAllTags(items) {
        const tagMap = new Map(); // tag -> count
        
        const collectTags = (items) => {
            items.forEach(item => {
                if (item.type === 'bookmark' && item.tags && item.tags.length > 0) {
                    item.tags.forEach(tag => {
                        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                    });
                }
                if (item.children && item.children.length > 0) {
                    collectTags(item.children);
                }
            });
        };
        
        collectTags(items);
        
        // 转换为数组并按数量排序
        this.allTags = Array.from(tagMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * 统计文件夹中的书签数量
     */
    countBookmarksInFolder(folder) {
        let count = 0;
        const countRecursive = (items) => {
            items.forEach(item => {
                if (item.type === 'bookmark') {
                    count++;
                } else if (item.type === 'folder' && item.children) {
                    countRecursive(item.children);
                }
            });
        };
        if (folder.children) {
            countRecursive(folder.children);
        }
        return count;
    }

    /**
     * 统计所有书签数量
     */
    countAllBookmarks(items) {
        let count = 0;
        const countRecursive = (items) => {
            items.forEach(item => {
                if (item.type === 'bookmark') {
                    count++;
                } else if (item.type === 'folder' && item.children) {
                    countRecursive(item.children);
                }
            });
        };
        countRecursive(items);
        return count;
    }

    /**
     * 获取过滤后的数据
     */
    getFilteredData() {
        let data = this.data;

        // 先按分类过滤
        if (this.selectedCategory) {
            data = data.filter(item => 
                item.type === 'folder' && item.name === this.selectedCategory
            );
        }

        // 标签过滤
        if (this.selectedTags.length > 0) {
            const filterByTags = (items) => {
                const result = [];
                items.forEach(item => {
                    if (item.type === 'bookmark') {
                        // 检查书签是否包含所有选中的标签
                        const itemTags = item.tags || [];
                        const hasAllTags = this.selectedTags.every(tag => itemTags.includes(tag));
                        if (hasAllTags) {
                            result.push(item);
                        }
                    } else if (item.type === 'folder') {
                        const filteredChildren = filterByTags(item.children || []);
                        if (filteredChildren.length > 0) {
                            result.push({
                                ...item,
                                children: filteredChildren
                            });
                        }
                    }
                });
                return result;
            };
            data = filterByTags(data);
        }

        // 如果没有搜索词，直接返回分类和标签过滤后的数据
        if (!this.searchQuery) {
            return data;
        }

        // 搜索过滤
        const filterRecursive = (items) => {
            const result = [];
            items.forEach(item => {
                if (item.type === 'bookmark') {
                    // 搜索标题、描述、URL、标签
                    const meta = this.plugin.settings.metadata[item.url] || {};
                    const title = (plTitle(item, meta) || '').toLowerCase();
                    const desc = (plDesc(item, meta) || '').toLowerCase();
                    const url = (item.url || '').toLowerCase();
                    const tags = (item.tags || []).join(' ').toLowerCase();
                    
                    if (title.includes(this.searchQuery) || 
                        desc.includes(this.searchQuery) || 
                        url.includes(this.searchQuery) ||
                        tags.includes(this.searchQuery)) {
                        result.push(item);
                    }
                } else if (item.type === 'folder') {
                    // 对文件夹递归搜索
                    const filteredChildren = filterRecursive(item.children || []);
                    if (filteredChildren.length > 0) {
                        result.push({
                            ...item,
                            children: filteredChildren
                        });
                    }
                    // 也检查文件夹名称是否匹配
                    else if (item.name.toLowerCase().includes(this.searchQuery)) {
                        result.push(item);
                    }
                }
            });
            return result;
        };

        return filterRecursive(data);
    }

    /**
     * 更新搜索统计信息
     */
    updateStats(filteredData) {
        if (!this.statsContainer) return;
        this.statsContainer.empty();

        const totalFiltered = this.countAllBookmarks(filteredData);
        const total = this.countAllBookmarks(this.data);

        if (this.searchQuery || this.selectedCategory || this.selectedTags.length > 0) {
            this.statsContainer.createSpan({ 
                cls: 'stats-text',
                text: `显示 ${totalFiltered} / ${total} 个书签`
            });
            
            // 显示当前筛选的标签
            if (this.selectedTags.length > 0) {
                const tagInfo = this.statsContainer.createSpan({ cls: 'stats-tags' });
                tagInfo.textContent = ` · 标签: ${this.selectedTags.map(t => '#' + t).join(', ')}`;
            }
        }
    }

    async loadFile() {
        const path = this.plugin.settings.bookmarkFilePath;
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!file) {
            new Notice(`无法加载数据，找不到文件: ${path}`);
            return;
        }
        const content = await this.app.vault.read(file);
        this.data = this.parseContentRecursively(content);
        if (Object.values(this.plugin.settings.metadata || {}).some((m) => m && m.customDescription)) {
            await this.plMigrateLegacyDescriptions();
        }
        this.triggerMetadataFetch(this.data);
    }

    async triggerMetadataFetch(items) {
        const processItem = async (item) => {
            if (item.type === 'bookmark' && item.url) {
                const cacheKey = item.url;
                const cached = this.plugin.settings.metadata[cacheKey];
                if (cached) {
                    item.meta = cached;
                } else {
                    this.fetchMetadata(item.url);
                }
            }
            if (item.children) {
                for (const child of item.children) {
                    await processItem(child);
                }
            }
        };
        for (const item of items) {
            await processItem(item);
        }
    }

    async refreshAllMetadata() {
        const processItem = async (item) => {
            if (item.type === 'bookmark' && item.url) {
                await this.fetchMetadata(item.url);
            }
            if (item.children) {
                for (const child of item.children) {
                    await processItem(child);
                }
            }
        }
        for (const item of this.data) {
            await processItem(item);
        }
    }

    parseContentRecursively(content) {
        const lines = content.split('\n');
        const root = [];
        let stack = [];

        // 解析标签的辅助函数 - 支持 Obsidian 风格的标签
        const extractTags = (text) => {
            const tagRegex = /#([^\s#\[\](){}]+)/g;
            const tags = [];
            let match;
            while ((match = tagRegex.exec(text)) !== null) {
                // 过滤掉纯数字标签和过短的标签
                const tag = match[1];
                if (tag.length > 0 && !/^\d+$/.test(tag)) {
                    tags.push(tag);
                }
            }
            return [...new Set(tags)]; // 去重
        };

        // 从文本中移除标签的辅助函数
        const removeTagsFromText = (text) => {
            return text.replace(/#[^\s#\[\](){}]+/g, '').trim();
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            if (!trimmed) continue;

            const headerMatch = line.match(/^(#{2,})\s+(.*)/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const title = headerMatch[2].trim();
                const indentVal = -1 + (level - 2) * 0.1;

                const newFolder = {
                    type: 'folder',
                    name: title,
                    children: [],
                    indent: indentVal,
                    section: 'h' + level
                };

                while (stack.length > 0 && stack[stack.length - 1].indent >= indentVal) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    root.push(newFolder);
                } else {
                    stack[stack.length - 1].children.push(newFolder);
                }

                stack.push(newFolder);
                continue;
            }

            const listMatch = line.match(/^(\s*)- (.*)/);
            if (listMatch) {
                const indentStr = listMatch[1];
                const contentStr = listMatch[2];
                const indentLevel = indentStr.length;

                // 先把开头的链接切出来，标签只从链接后面的文字里取（网址里的 #/home 不是标签）
                const linkHead = contentStr.match(/^\[[^\]]*\]\(\S*?\)(?=\s|$)|^https?:\/\/\S+/);
                const linkStr = linkHead ? linkHead[0] : '';
                const restStr = contentStr.slice(linkStr.length);
                const lineTags = extractTags(linkStr ? restStr : contentStr);
                const cleanContent = linkStr ? (linkStr + ' ' + removeTagsFromText(restStr)).trim() : removeTagsFromText(contentStr);

                const markdownLinkMatch = cleanContent.match(/^\[(.*?)\]\((\S*?)\)(?=\s|$)/);
                const rawUrlMatch = cleanContent.match(/^(https?:\/\/[^\s]+)/);

                let isLink = false;
                let name = cleanContent;
                let url = null;

                if (markdownLinkMatch) {
                    isLink = true;
                    name = markdownLinkMatch[1];
                    url = markdownLinkMatch[2];
                } else if (rawUrlMatch) {
                    isLink = true;
                    name = rawUrlMatch[1];
                    url = rawUrlMatch[1];
                }

                const newItem = {
                    type: isLink ? 'bookmark' : 'folder',
                    name: name,
                    url: url,
                    children: [],
                    description: '',
                    indent: indentLevel,
                    tags: lineTags // 添加标签数组
                };

                if (stack.length === 0) continue;

                while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
                    stack.pop();
                }

                if (stack.length === 0) continue;
                const parent = stack[stack.length - 1];

                if (parent.type === 'bookmark') {
                    parent.description += (parent.description ? '\n' : '') + contentStr;
                    // 同时从描述中提取标签并合并
                    const descTags = extractTags(contentStr);
                    if (descTags.length > 0) {
                        parent.tags = [...new Set([...(parent.tags || []), ...descTags])];
                    }
                } else {
                    parent.children.push(newItem);
                    stack.push(newItem);
                }
            }
            else if (line.match(/^\s+/)) {
                if (stack.length === 0) continue;

                const indentLevel = line.match(/^\s+/)[0].length;
                const textContent = line.trim();

                while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
                    stack.pop();
                }
                if (stack.length > 0) {
                    const parent = stack[stack.length - 1];
                    if (parent.type === 'bookmark') {
                        parent.description += (parent.description ? '\n' : '') + textContent;
                        // 从描述行中提取标签
                        const descTags = extractTags(textContent);
                        if (descTags.length > 0) {
                            parent.tags = [...new Set([...(parent.tags || []), ...descTags])];
                        }
                    }
                }
            }
            else if (stack.length > 0) {
                // 分类里的普通段落文字：挂在所属分类上，写回时原样放在分类标题下面
                const owner = [...stack].reverse().find((s) => s.type === 'folder' && s.section);
                if (owner) (owner.notes = owner.notes || []).push(line);
            }
        }
        return root;
    }

    renderTree(container, items) {
        if (!items || items.length === 0) return;

        items.forEach(item => {
            const itemDiv = container.createDiv({ cls: 'tree-item' });

            const header = itemDiv.createDiv({
                cls: item.type === 'folder' ? 'tree-item-header is-folder' : 'bookmark-link is-link'
            });

            const iconSpan = header.createSpan({ cls: 'tree-icon' });
            if (item.type === 'folder') {
                setIcon(iconSpan, 'folder');
            } else {
                setIcon(iconSpan, 'link');
            }

            const textSpan = header.createSpan({ text: item.name });
            
            // 在列表视图中显示标签
            if (this.plugin.settings.enableTags && item.type === 'bookmark' && item.tags && item.tags.length > 0) {
                const tagsSpan = header.createSpan({ cls: 'tree-item-tags' });
                item.tags.slice(0, 3).forEach(tag => {
                    const tagChip = tagsSpan.createSpan({ cls: 'tree-tag-chip' });
                    tagChip.textContent = `#${tag}`;
                });
                if (item.tags.length > 3) {
                    const moreChip = tagsSpan.createSpan({ cls: 'tree-tag-chip' });
                    moreChip.textContent = `+${item.tags.length - 3}`;
                }
            }
            
            if (item.description) {
                header.title = `${item.name}\n${item.description}\n${item.url || ''}`;
            } else if (item.url) {
                header.title = item.url;
            }

            if (item.type === 'folder') {
                const childrenDiv = itemDiv.createDiv({ cls: 'tree-item-children' });
                this.renderTree(childrenDiv, item.children);

                if (item.indent >= 0) {
                    childrenDiv.style.display = 'none';
                } else {
                    childrenDiv.style.display = 'flex';
                }

                header.onclick = (e) => {
                    e.stopPropagation();
                    if (childrenDiv.style.display === 'none') {
                        childrenDiv.style.display = 'flex';
                    } else {
                        childrenDiv.style.display = 'none';
                    }
                };
            } else {
                header.onclick = (e) => {
                    window.open(item.url);
                };
            }
        });
    }

    renderGrid(container, items) {
        items.forEach(item => {
            if (item.type === 'folder') {
                const categorySection = container.createDiv({ cls: 'grid-category-section' });
                categorySection.dataset.category = item.name;
                
                const header = categorySection.createDiv({ cls: 'grid-category-header' });
                header.createSpan({ text: item.name });
                
                // 添加书签数量徽章
                const countBadge = header.createSpan({ cls: 'category-count-badge' });
                countBadge.textContent = this.countBookmarksInFolder(item);
                
                const gridDiv = categorySection.createDiv({ cls: 'bookmarks-grid droppable-grid' });
                gridDiv.dataset.category = item.name;
                
                // 为网格容器添加拖放事件
                this.setupDropZone(gridDiv, item);
                
                this.renderGridItems(gridDiv, item.children);

            } else if (item.type === 'bookmark') {
                let section = container.querySelector('.grid-category-section[data-category="__uncategorized__"]');
                let gridDiv;
                if (!section) {
                    section = container.createDiv({ cls: 'grid-category-section' });
                    section.dataset.category = '__uncategorized__';
                    gridDiv = section.createDiv({ cls: 'bookmarks-grid droppable-grid' });
                    gridDiv.dataset.category = '__uncategorized__';
                    this.setupDropZone(gridDiv, null);
                } else {
                    gridDiv = section.querySelector('.bookmarks-grid');
                }
                this.createCard(gridDiv, item);
            }
        });
    }

    renderGridItems(container, items) {
        items.forEach(item => {
            if (item.type === 'bookmark') {
                this.createCard(container, item);
            } else if (item.type === 'folder') {
                this.renderGridItems(container, item.children);
            }
        });
    }

    /**
     * 渲染表格视图
     */
    renderTable(container, items) {
        // 扁平化所有书签数据
        const bookmarks = this.flattenBookmarks(items);
        
        // 排序
        const sortedBookmarks = this.sortBookmarks(bookmarks);
        
        // 创建表格容器
        const tableWrapper = container.createDiv({ cls: 'table-view-wrapper' });
        const table = tableWrapper.createEl('table', { cls: 'bookmarks-table' });
        
        // 创建表头
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        
        // 定义表头列
        const columns = [
            { key: 'title', label: '标题', sortable: true },
            { key: 'domain', label: '域名', sortable: true },
            { key: 'category', label: '分类', sortable: true },
            { key: 'tags', label: '标签', sortable: false },
            { key: 'status', label: '状态', sortable: true }
        ];
        
        columns.forEach(col => {
            const th = headerRow.createEl('th', { cls: `col-${col.key}` });
            const headerContent = th.createDiv({ cls: 'th-content' });
            headerContent.createSpan({ text: col.label });
            
            if (col.sortable) {
                th.addClass('sortable');
                const sortIcon = headerContent.createSpan({ cls: 'sort-icon' });
                
                if (this.tableSortColumn === col.key) {
                    th.addClass('sorted');
                    th.addClass(this.tableSortDirection);
                    setIcon(sortIcon, this.tableSortDirection === 'asc' ? 'chevron-up' : 'chevron-down');
                } else {
                    setIcon(sortIcon, 'chevrons-up-down');
                }
                
                th.onclick = () => {
                    if (this.tableSortColumn === col.key) {
                        this.tableSortDirection = this.tableSortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.tableSortColumn = col.key;
                        this.tableSortDirection = 'asc';
                    }
                    this.renderContent(container);
                };
            }
        });
        
        // 操作列
        headerRow.createEl('th', { cls: 'col-actions', text: '' });
        
        // 创建表体
        const tbody = table.createEl('tbody');
        
        if (sortedBookmarks.length === 0) {
            const emptyRow = tbody.createEl('tr', { cls: 'empty-row' });
            const emptyCell = emptyRow.createEl('td', { attr: { colspan: columns.length + 1 } });
            emptyCell.createDiv({ cls: 'table-empty-state', text: '暂无书签数据' });
        } else {
            sortedBookmarks.forEach(bookmark => {
                this.createTableRow(tbody, bookmark, columns);
            });
        }
        
        // 显示统计
        const tableFooter = tableWrapper.createDiv({ cls: 'table-footer' });
        tableFooter.createSpan({ text: `共 ${sortedBookmarks.length} 条书签` });
    }

    /**
     * 扁平化书签数据（将嵌套结构转为一维数组）
     */
    flattenBookmarks(items, category = '') {
        const result = [];
        
        items.forEach(item => {
            if (item.type === 'bookmark') {
                result.push({
                    ...item,
                    category: category || '未分类'
                });
            } else if (item.type === 'folder') {
                const subItems = this.flattenBookmarks(item.children || [], item.name);
                result.push(...subItems);
            }
        });
        
        return result;
    }

    /**
     * 排序书签
     */
    sortBookmarks(bookmarks) {
        const col = this.tableSortColumn;
        const dir = this.tableSortDirection;
        
        return [...bookmarks].sort((a, b) => {
            let valA, valB;
            
            switch (col) {
                case 'title':
                    const metaA = this.plugin.settings.metadata[a.url] || {};
                    const metaB = this.plugin.settings.metadata[b.url] || {};
                    valA = (metaA.title || a.name || '').toLowerCase();
                    valB = (metaB.title || b.name || '').toLowerCase();
                    break;
                case 'domain':
                    valA = this.extractDomain(a.url).toLowerCase();
                    valB = this.extractDomain(b.url).toLowerCase();
                    break;
                case 'category':
                    valA = (a.category || '').toLowerCase();
                    valB = (b.category || '').toLowerCase();
                    break;
                case 'status':
                    const statusA = this.plugin.settings.linkStatus[a.url];
                    const statusB = this.plugin.settings.linkStatus[b.url];
                    valA = statusA ? (statusA.status === 'valid' ? 0 : 1) : 2;
                    valB = statusB ? (statusB.status === 'valid' ? 0 : 1) : 2;
                    break;
                default:
                    valA = '';
                    valB = '';
            }
            
            if (valA < valB) return dir === 'asc' ? -1 : 1;
            if (valA > valB) return dir === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * 提取域名
     */
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }

    /**
     * 创建表格行
     */
    createTableRow(tbody, bookmark, columns) {
        const row = tbody.createEl('tr', { cls: 'bookmark-row' });
        row.dataset.url = bookmark.url;
        
        const meta = this.plugin.settings.metadata[bookmark.url] || {};
        const title = plTitle(bookmark, meta);
        const domain = this.extractDomain(bookmark.url);
        const linkStatus = this.plugin.settings.linkStatus[bookmark.url];
        
        // 标题列
        const titleCell = row.createEl('td', { cls: 'col-title' });
        const titleWrapper = titleCell.createDiv({ cls: 'title-wrapper' });
        
        // Favicon
        const favicon = titleWrapper.createEl('img', { cls: 'row-favicon' });
        favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        favicon.onerror = () => {
            favicon.style.display = 'none';
        };
        
        const titleLink = titleWrapper.createEl('a', { 
            cls: 'row-title',
            text: title,
            href: bookmark.url
        });
        titleLink.onclick = (e) => {
            e.preventDefault();
            window.open(bookmark.url, '_blank');
        };
        
        // 域名列
        const domainCell = row.createEl('td', { cls: 'col-domain' });
        domainCell.createSpan({ cls: 'domain-text', text: domain });
        
        // 分类列
        const categoryCell = row.createEl('td', { cls: 'col-category' });
        const categoryBadge = categoryCell.createSpan({ cls: 'category-badge' });
        categoryBadge.textContent = bookmark.category;
        categoryBadge.onclick = () => {
            if (bookmark.category !== '未分类') {
                this.selectedCategory = bookmark.category;
                const mainContainer = this.containerEl.children[1];
                this.loadAndRender(mainContainer);
            }
        };
        
        // 标签列
        const tagsCell = row.createEl('td', { cls: 'col-tags' });
        if (bookmark.tags && bookmark.tags.length > 0) {
            const tagsWrapper = tagsCell.createDiv({ cls: 'tags-wrapper' });
            bookmark.tags.slice(0, 3).forEach(tag => {
                const tagChip = tagsWrapper.createSpan({ cls: 'table-tag-chip' });
                tagChip.textContent = `#${tag}`;
                tagChip.onclick = () => {
                    if (!this.selectedTags.includes(tag)) {
                        this.selectedTags.push(tag);
                    }
                    const mainContainer = this.containerEl.children[1];
                    this.loadAndRender(mainContainer);
                };
            });
            if (bookmark.tags.length > 3) {
                const moreTag = tagsWrapper.createSpan({ cls: 'table-tag-more' });
                moreTag.textContent = `+${bookmark.tags.length - 3}`;
            }
        } else {
            tagsCell.createSpan({ cls: 'no-tags', text: '-' });
        }
        
        // 状态列
        const statusCell = row.createEl('td', { cls: 'col-status' });
        const statusBadge = statusCell.createDiv({ cls: 'status-badge' });
        
        if (linkStatus) {
            if (linkStatus.status === 'valid') {
                statusBadge.addClass('status-valid');
                setIcon(statusBadge, 'check-circle');
                statusBadge.setAttribute('title', '链接正常');
            } else if (linkStatus.status === 'invalid') {
                statusBadge.addClass('status-invalid');
                setIcon(statusBadge, 'alert-triangle');
                statusBadge.setAttribute('title', '链接可能失效');
            }
        } else {
            statusBadge.addClass('status-unknown');
            setIcon(statusBadge, 'help-circle');
            statusBadge.setAttribute('title', '未检测');
        }
        
        // 操作列
        const actionsCell = row.createEl('td', { cls: 'col-actions' });
        const actionsWrapper = actionsCell.createDiv({ cls: 'actions-wrapper' });
        
        // 复制按钮
        const copyBtn = actionsWrapper.createDiv({ cls: 'row-action-btn' });
        setIcon(copyBtn, 'copy');
        copyBtn.setAttribute('title', '复制链接');
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(bookmark.url).then(() => {
                new Notice('✅ 链接已复制');
            });
        };
        
        // 更多按钮
        const moreBtn = actionsWrapper.createDiv({ cls: 'row-action-btn' });
        setIcon(moreBtn, 'more-horizontal');
        moreBtn.setAttribute('title', '更多操作');
        moreBtn.onclick = (e) => {
            e.stopPropagation();
            this.showTableRowMenu(e, bookmark, row, moreBtn);
        };
        
        // 双击打开
        row.ondblclick = () => {
            window.open(bookmark.url, '_blank');
        };
    }

    /**
     * 显示表格行的操作菜单
     */
    showTableRowMenu(e, item, row, triggerBtn) {
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'bookmark-context-menu';
        
        const menuItems = [
            {
                icon: 'external-link',
                text: '在新标签页打开',
                action: () => window.open(item.url, '_blank')
            },
            {
                icon: 'copy',
                text: '复制链接',
                action: () => {
                    navigator.clipboard.writeText(item.url).then(() => {
                        new Notice('✅ 链接已复制');
                    });
                }
            },
            { type: 'separator' },
            {
                icon: 'hash',
                text: '编辑标签',
                action: () => this.showEditTagsModal(item)
            },
            { type: 'separator' },
            {
                icon: 'trash-2',
                text: '删除书签',
                danger: true,
                action: () => this.showDeleteConfirm(item)
            }
        ];

        menuItems.forEach(menuItem => {
            if (menuItem.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                menu.appendChild(separator);
            } else {
                const itemEl = document.createElement('div');
                itemEl.className = 'context-menu-item' + (menuItem.danger ? ' danger' : '');

                const iconSpan = document.createElement('span');
                iconSpan.className = 'context-menu-icon';
                setIcon(iconSpan, menuItem.icon);

                const textSpan = document.createElement('span');
                textSpan.className = 'context-menu-text';
                textSpan.textContent = menuItem.text;

                itemEl.appendChild(iconSpan);
                itemEl.appendChild(textSpan);

                itemEl.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.hideContextMenu();
                    menuItem.action();
                });

                menu.appendChild(itemEl);
            }
        });

        document.body.appendChild(menu);
        
        const btnRect = triggerBtn.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = btnRect.right - menuRect.width;
        let y = btnRect.bottom + 4;

        if (x < 10) x = 10;
        if (y + menuRect.height > viewportHeight - 10) {
            y = btnRect.top - menuRect.height - 4;
        }

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        triggerBtn.classList.add('is-active');
        this.currentContextMenu = menu;
        this.currentMenuTrigger = triggerBtn;

        const closeHandler = (evt) => {
            if (!menu.contains(evt.target) && evt.target !== triggerBtn) {
                this.hideContextMenu();
            }
        };
        
        this.hideContextMenuHandler = closeHandler;
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler, true);
        }, 10);
    }

    /**
     * 设置拖放区域
     */
    setupDropZone(gridDiv, folderItem) {
        gridDiv.ondragover = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            gridDiv.addClass('drag-over');
            
            // 计算并显示插入位置指示器
            this.updateDropIndicator(gridDiv, e);
        };

        gridDiv.ondragleave = (e) => {
            // 检查是否真的离开了容器
            if (!gridDiv.contains(e.relatedTarget)) {
                gridDiv.removeClass('drag-over');
                this.hideDropIndicator();
            }
        };

        gridDiv.ondrop = async (e) => {
            e.preventDefault();
            gridDiv.removeClass('drag-over');
            this.hideDropIndicator();

            if (!this.draggedItem || !this.draggedElement) return;

            const targetCategory = gridDiv.dataset.category;
            const dropIndex = this.calculateDropIndex(gridDiv, e);

            await this.moveBookmark(
                this.draggedItem, 
                this.dragSourceCategory, 
                targetCategory, 
                dropIndex
            );
        };
    }

    /**
     * 更新拖放位置指示器
     */
    updateDropIndicator(gridDiv, e) {
        if (!this.dropIndicator) {
            this.dropIndicator = document.createElement('div');
            this.dropIndicator.className = 'drop-indicator';
        }

        const cards = Array.from(gridDiv.querySelectorAll('.grid-card:not(.dragging)'));
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        let insertBefore = null;
        let closestDistance = Infinity;

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            // 只考虑同一行或上方的卡片
            if (Math.abs(mouseY - cardCenterY) < rect.height) {
                // 判断是否在卡片左侧
                if (mouseX < cardCenterX) {
                    const distance = cardCenterX - mouseX;
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        insertBefore = card;
                    }
                }
            }
        }

        // 移除旧的指示器
        if (this.dropIndicator.parentNode) {
            this.dropIndicator.parentNode.removeChild(this.dropIndicator);
        }

        // 插入指示器
        if (insertBefore) {
            gridDiv.insertBefore(this.dropIndicator, insertBefore);
        } else {
            gridDiv.appendChild(this.dropIndicator);
        }
    }

    /**
     * 隐藏拖放指示器
     */
    hideDropIndicator() {
        if (this.dropIndicator && this.dropIndicator.parentNode) {
            this.dropIndicator.parentNode.removeChild(this.dropIndicator);
        }
    }

    /**
     * 计算拖放位置的索引
     */
    calculateDropIndex(gridDiv, e) {
        const cards = Array.from(gridDiv.querySelectorAll('.grid-card:not(.dragging)'));
        const mouseX = e.clientX;

        for (let i = 0; i < cards.length; i++) {
            const rect = cards[i].getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            
            if (mouseX < cardCenterX) {
                return i;
            }
        }
        
        return cards.length;
    }

    async fetchMetadata(url) {
        if (!url.startsWith('http')) return;
        try {
            const response = await requestUrl({
                url: url,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
            const html = response.text;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title;
            const description = doc.querySelector('meta[property="og:description"]')?.content || doc.querySelector('meta[name="description"]')?.content || "";
            
            // Priority 1: og:image
            let image = doc.querySelector('meta[property="og:image"]')?.content || "";
            
            // Priority 2: Screenshot API (if no og:image)
            if (!image) {
                image = await this.getScreenshotUrl(url);
            }
            
            // Priority 3: Favicon as last resort
            if (!image) {
                image = this.getFaviconUrl(url, doc);
            }

            if (title || image) {
                this.plugin.settings.metadata[url] = { title, description, image };
                await this.plugin.saveSettings();
            }
        } catch (e) {
            console.error(`Failed to fetch metadata for ${url}`, e);
            // Even on error, try to get at least a favicon
            const faviconUrl = this.getFaviconUrl(url);
            if (faviconUrl) {
                this.plugin.settings.metadata[url] = { 
                    title: '', 
                    description: '', 
                    image: faviconUrl 
                };
                await this.plugin.saveSettings();
            }
        }
    }

    /**
     * Get screenshot URL using configured screenshot API
     * Supports multiple free screenshot services
     */
    async getScreenshotUrl(url) {
        const screenshotApi = this.plugin.settings.screenshotApi || 'none';
        const encodedUrl = encodeURIComponent(url);
        
        let screenshotUrl = '';
        
        switch (screenshotApi) {
            case 'microlink':
                // Microlink - Free tier available
                screenshotUrl = `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`;
                try {
                    const response = await requestUrl({ url: screenshotUrl });
                    const data = JSON.parse(response.text);
                    if (data.status === 'success' && data.data?.screenshot?.url) {
                        return data.data.screenshot.url;
                    }
                } catch (e) {
                    console.error('Microlink screenshot failed:', e);
                }
                break;
                
            case 'pagepeeker':
                // PagePeeker - Free tier available
                return `https://free.pagepeeker.com/v2/thumbs.php?size=x&url=${encodedUrl}`;
                
            case 'screenshotmachine':
                // Screenshot Machine - requires API key
                const apiKey = this.plugin.settings.screenshotApiKey;
                if (apiKey) {
                    return `https://api.screenshotmachine.com?key=${apiKey}&url=${encodedUrl}&dimension=800x600`;
                }
                break;
                
            case 'thum':
                // Thum.io - Free tier available
                return `https://image.thum.io/get/width/800/${url}`;
                
            case 'custom':
                // Custom API URL - replace {url} placeholder
                const customTemplate = this.plugin.settings.customScreenshotApi;
                if (customTemplate) {
                    return customTemplate.replace('{url}', encodedUrl);
                }
                break;
                
            default:
                // 'none' - skip screenshot API
                break;
        }
        
        return '';
    }

    /**
     * Get favicon URL from the website
     */
    getFaviconUrl(url, doc = null) {
        try {
            const urlObj = new URL(url);
            const origin = urlObj.origin;
            
            // Try to get favicon from parsed document
            if (doc) {
                // Check for various favicon link tags
                const iconSelectors = [
                    'link[rel="icon"]',
                    'link[rel="shortcut icon"]',
                    'link[rel="apple-touch-icon"]',
                    'link[rel="apple-touch-icon-precomposed"]'
                ];
                
                for (const selector of iconSelectors) {
                    const iconLink = doc.querySelector(selector);
                    if (iconLink?.href) {
                        const href = iconLink.getAttribute('href');
                        // Handle relative URLs
                        if (href.startsWith('//')) {
                            return 'https:' + href;
                        } else if (href.startsWith('/')) {
                            return origin + href;
                        } else if (href.startsWith('http')) {
                            return href;
                        } else {
                            return origin + '/' + href;
                        }
                    }
                }
            }
            
            // Fallback to Google Favicon service (more reliable)
            return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
            
        } catch (e) {
            console.error('Failed to get favicon:', e);
            return '';
        }
    }

    createCard(container, item) {
        const card = container.createDiv({ cls: 'grid-card' });

        const meta = item.meta || this.plugin.settings.metadata[item.url] || {};
        const title = plTitle(item, meta);
        // md 里写的描述优先，其次旧版自定义描述，再次抓取的简介，最后是 URL
        const desc = plDesc(item, meta) || item.url;
        const image = meta.image;

        // 获取链接状态
        const linkStatus = this.plugin.settings.linkStatus[item.url];
        if (linkStatus) {
            if (linkStatus.status === 'invalid') {
                card.addClass('link-invalid');
            } else if (linkStatus.status === 'valid') {
                card.addClass('link-valid');
            }
        }

        // 链接状态指示器
        const statusIndicator = card.createDiv({ cls: 'link-status-indicator' });
        if (linkStatus) {
            if (linkStatus.status === 'invalid') {
                setIcon(statusIndicator, 'alert-triangle');
                statusIndicator.addClass('status-invalid');
                statusIndicator.setAttribute('title', `链接可能失效\n上次检测: ${this.formatDate(linkStatus.lastCheck)}`);
            } else if (linkStatus.status === 'valid') {
                setIcon(statusIndicator, 'check-circle');
                statusIndicator.addClass('status-valid');
                statusIndicator.setAttribute('title', `链接正常\n上次检测: ${this.formatDate(linkStatus.lastCheck)}`);
            }
        }

        // 重新检测单个链接
        statusIndicator.onclick = async (e) => {
            e.stopPropagation();
            statusIndicator.addClass('checking');
            setIcon(statusIndicator, 'loader');
            
            const isValid = await this.checkSingleLink(item.url);
            
            statusIndicator.removeClass('checking');
            if (isValid) {
                card.removeClass('link-invalid');
                card.addClass('link-valid');
                statusIndicator.removeClass('status-invalid');
                statusIndicator.addClass('status-valid');
                setIcon(statusIndicator, 'check-circle');
                new Notice('✅ 链接正常');
            } else {
                card.removeClass('link-valid');
                card.addClass('link-invalid');
                statusIndicator.removeClass('status-valid');
                statusIndicator.addClass('status-invalid');
                setIcon(statusIndicator, 'alert-triangle');
                new Notice('⚠️ 链接可能失效');
            }
        };

        // 更多操作按钮（右上角）
        const moreBtn = card.createDiv({ cls: 'card-more-btn' });
        setIcon(moreBtn, 'more-vertical');
        moreBtn.setAttribute('title', '更多操作');

        const coverDiv = card.createDiv({ cls: 'card-cover' });
        // Correctly use default image setting
        const defaultImg = this.plugin.settings.defaultImage || DEFAULT_COVER_SVG;

        const img = coverDiv.createEl('img');
        img.src = image || defaultImg;

        img.onerror = () => {
            if (img.src !== defaultImg) {
                img.src = defaultImg;
            } else {
                img.style.display = 'none';
                coverDiv.addClass('no-image');
                setIcon(coverDiv, 'image');
            }
        };

        const infoDiv = card.createDiv({ cls: 'card-info' });
        const titleDiv = infoDiv.createDiv({ cls: 'card-title' });
        titleDiv.createSpan({ text: title });

        const descDiv = infoDiv.createDiv({ cls: 'card-desc editable-desc' });
        descDiv.textContent = desc;
        descDiv.setAttribute('title', '点击编辑简介');

        // 显示标签
        if (this.plugin.settings.enableTags && item.tags && item.tags.length > 0) {
            const tagsDiv = infoDiv.createDiv({ cls: 'card-tags' });
            item.tags.forEach(tag => {
                const tagChip = tagsDiv.createSpan({ cls: 'card-tag-chip' });
                tagChip.textContent = `#${tag}`;
                tagChip.setAttribute('title', `点击筛选标签: ${tag}`);
                
                // 点击标签进行筛选
                tagChip.onclick = (e) => {
                    e.stopPropagation();
                    // 如果标签未被选中，添加到筛选
                    if (!this.selectedTags.includes(tag)) {
                        this.selectedTags.push(tag);
                    } else {
                        // 如果已选中，则移除
                        this.selectedTags = this.selectedTags.filter(t => t !== tag);
                    }
                    const mainContainer = this.containerEl.children[1];
                    this.loadAndRender(mainContainer);
                };
                
                // 高亮已选中的标签
                if (this.selectedTags.includes(tag)) {
                    tagChip.addClass('is-active');
                }
            });
        }

        // 点击简介进入编辑模式
        descDiv.onclick = (e) => {
            e.stopPropagation(); // 阻止卡片的点击事件
            this.enterEditMode(descDiv, item);
        };

        // 封面区域点击打开链接
        coverDiv.onclick = (e) => {
            e.stopPropagation();
            window.open(item.url);
        };

        // 标题区域点击打开链接
        titleDiv.onclick = (e) => {
            e.stopPropagation();
            window.open(item.url);
        };

        // ===== 更多按钮点击显示菜单 =====
        moreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showContextMenu(e, item, card, titleDiv, moreBtn);
        });

        // ===== 拖拽事件 =====
        const categoryName = container.dataset.category || '__uncategorized__';
        card.draggable = true;
        card.dataset.url = item.url;
        card.dataset.category = categoryName;

        card.ondragstart = (e) => {
            this.draggedItem = item;
            this.draggedElement = card;
            this.dragSourceCategory = categoryName;
            
            card.addClass('dragging');
            
            // 设置拖拽数据
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.url);
            
            // 延迟添加拖拽中的样式
            setTimeout(() => {
                card.style.opacity = '0.4';
            }, 0);
        };

        card.ondragend = (e) => {
            card.removeClass('dragging');
            card.style.opacity = '1';
            this.hideDropIndicator();
            
            // 移除所有拖拽相关样式
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            
            this.draggedItem = null;
            this.draggedElement = null;
            this.dragSourceCategory = null;
        };
    }

    /**
     * 移动书签到新位置
     */
    async moveBookmark(bookmark, sourceCategory, targetCategory, targetIndex) {
        // 在数据结构中找到并移动书签
        const findAndRemoveBookmark = (items, url) => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type === 'bookmark' && item.url === url) {
                    return items.splice(i, 1)[0];
                }
                if (item.type === 'folder' && item.children) {
                    const found = findAndRemoveBookmark(item.children, url);
                    if (found) return found;
                }
            }
            return null;
        };

        const findCategoryAndInsert = (items, categoryName, bookmark, index) => {
            for (const item of items) {
                if (item.type === 'folder' && item.name === categoryName) {
                    // 获取该分类下的所有书签（排除子文件夹）
                    const bookmarks = item.children.filter(c => c.type === 'bookmark');
                    const folders = item.children.filter(c => c.type === 'folder');
                    
                    // 在指定位置插入
                    const clampedIndex = Math.min(index, bookmarks.length);
                    bookmarks.splice(clampedIndex, 0, bookmark);
                    
                    // 重建 children 数组
                    item.children = [...folders, ...bookmarks];
                    return true;
                }
                if (item.type === 'folder' && item.children) {
                    if (findCategoryAndInsert(item.children, categoryName, bookmark, index)) {
                        return true;
                    }
                }
            }
            return false;
        };

        // 移除书签
        const movedBookmark = findAndRemoveBookmark(this.data, bookmark.url);
        if (!movedBookmark) {
            new Notice('❌ 移动失败：找不到书签');
            return;
        }

        // 插入到目标位置
        if (targetCategory === '__uncategorized__') {
            // 规范 §7：未分类的书签放进「📥 待整理」，没有就在最前面新建
            let inbox = this.data.find((c) => c.type === 'folder' && c.name === PL_INBOX_SECTION);
            if (!inbox) {
                inbox = { type: 'folder', name: PL_INBOX_SECTION, children: [], indent: -1, section: 'h2' };
                this.data.unshift(inbox);
            }
            inbox.children.splice(Math.min(targetIndex, inbox.children.length), 0, movedBookmark);
        } else {
            if (!findCategoryAndInsert(this.data, targetCategory, movedBookmark, targetIndex)) {
                // 如果找不到目标分类，放回原位
                new Notice('❌ 移动失败：找不到目标分类');
                return;
            }
        }

        // 同步到 Markdown 文件
        await this.syncToFile();
        
        // 重新渲染
        const container = this.containerEl.children[1];
        this.loadAndRender(container);
        
        if (sourceCategory !== targetCategory) {
            new Notice(`✅ 已移动到「${targetCategory === '__uncategorized__' ? '未分类' : targetCategory}」`);
        } else {
            new Notice('✅ 排序已更新');
        }
    }

    /**
     * 将数据同步回 Markdown 文件
     */
    async syncToFile() {
        const body = this.dataToMarkdown(this.data).replace(/\n{3,}/g, '\n\n').trim();
        const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.bookmarkFilePath);
        if (!file) return;
        await this.app.vault.process(file, (old) => {
            const pre = plPreamble(old).replace(/\s*$/, '');
            return (pre ? pre + '\n\n' : '') + body + '\n';
        });
    }

    /**
     * 将数据结构转换为 Markdown 格式
     */
    dataToMarkdown(items, level = 2) {
        let markdown = '';
        
        items.forEach(item => {
            if (item.type === 'folder') {
                // 根据 section 确定标题级别，或使用默认 level
                const headerLevel = item.section ? parseInt(item.section.replace('h', '')) : level;
                const hashes = '#'.repeat(headerLevel);
                if (markdown && !markdown.endsWith('\n\n')) markdown += '\n';
                markdown += `${hashes} ${item.name}\n\n`;
                if (item.notes && item.notes.length) markdown += item.notes.join('\n') + '\n\n';
                
                if (item.children && item.children.length > 0) {
                    markdown += this.dataToMarkdown(item.children, headerLevel + 1);
                }
            } else if (item.type === 'bookmark') {
                // 书签格式：- [名称](URL) #tag1 #tag2
                let line = `- [${item.name}](${item.url})`;
                
                // 添加标签
                if (item.tags && item.tags.length > 0) {
                    const tagsStr = item.tags.map(t => `#${t}`).join(' ');
                    line += ` ${tagsStr}`;
                }
                
                markdown += line + '\n';
                
                // 如果有描述，添加缩进的描述行（不包含标签）
                if (item.description) {
                    // 从描述中移除标签
                    const cleanDesc = item.description.replace(/#[^\s#\[\](){}]+/g, '').trim();
                    if (cleanDesc) {
                        const descLines = cleanDesc.split('\n');
                        descLines.forEach(line => {
                            if (line.trim()) {
                                markdown += `\t${line.trim()}\n`;
                            }
                        });
                    }
                }
            }
        });
        
        return markdown;
    }

    /**
     * 进入简介编辑模式
     */
    enterEditMode(descDiv, item) {
        // 如果已经在编辑模式，不重复创建
        if (descDiv.querySelector('textarea')) return;

        const currentText = descDiv.textContent;
        descDiv.empty();
        descDiv.addClass('editing');

        const textarea = descDiv.createEl('textarea', {
            cls: 'desc-edit-textarea'
        });
        textarea.value = currentText;
        textarea.placeholder = '输入自定义简介...';

        // 自动聚焦并选中文本
        textarea.focus();
        textarea.select();

        // 自动调整高度
        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        };
        adjustHeight();
        textarea.addEventListener('input', adjustHeight);

        // 保存按钮容器
        const btnContainer = descDiv.createDiv({ cls: 'desc-edit-buttons' });
        
        const saveBtn = btnContainer.createEl('button', { 
            cls: 'desc-edit-btn save-btn',
            text: '保存'
        });
        
        const cancelBtn = btnContainer.createEl('button', { 
            cls: 'desc-edit-btn cancel-btn',
            text: '取消'
        });

        // 保存操作
        const saveEdit = async () => {
            const newDesc = textarea.value.trim();
            await this.saveCustomDescription(item.url, newDesc, item);
            this.exitEditMode(descDiv, newDesc || item.url);
            new Notice('✅ 简介已保存');
        };

        // 取消操作
        const cancelEdit = () => {
            const meta = this.plugin.settings.metadata[item.url] || {};
            const originalDesc = plDesc(item, meta) || item.url;
            this.exitEditMode(descDiv, originalDesc);
        };

        saveBtn.onclick = (e) => {
            e.stopPropagation();
            saveEdit();
        };

        cancelBtn.onclick = (e) => {
            e.stopPropagation();
            cancelEdit();
        };

        // 按键处理
        textarea.onkeydown = (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        };

        // 点击外部取消编辑
        textarea.onblur = (e) => {
            // 延迟检查，确保不是点击了按钮
            setTimeout(() => {
                if (!descDiv.contains(document.activeElement) && descDiv.classList.contains('editing')) {
                    cancelEdit();
                }
            }, 150);
        };
    }

    /**
     * 退出编辑模式
     */
    exitEditMode(descDiv, text) {
        descDiv.empty();
        descDiv.removeClass('editing');
        descDiv.textContent = text;
    }

    /**
     * 保存自定义描述到 metadata
     */
    async saveCustomDescription(url, description, item) {
        // 规范 §7：描述写在书签下一行（Tab 缩进），data.json 只保留抓取缓存
        const target = item || this.plFindBookmark(this.data, url);
        if (target) {
            target.description = String(description || '').trim();
            await this.syncToFile();
        }
        if (this.plugin.settings.metadata[url] && 'customDescription' in this.plugin.settings.metadata[url]) {
            delete this.plugin.settings.metadata[url].customDescription;
            await this.plugin.saveSettings();
        }
    }

    plFindBookmark(items, url) {
        for (const it of items || []) {
            if (it.type === 'bookmark' && it.url === url) return it;
            const hit = this.plFindBookmark(it.children, url);
            if (hit) return hit;
        }
        return null;
    }

    // 旧版把自定义简介只存在 data.json，载入时迁移进 md
    async plMigrateLegacyDescriptions() {
        const meta = this.plugin.settings.metadata || {};
        let moved = 0;
        const walk = (items) => (items || []).forEach((it) => {
            if (it.type === 'bookmark' && meta[it.url] && meta[it.url].customDescription) {
                if (!it.description) { it.description = meta[it.url].customDescription; moved++; }
                delete meta[it.url].customDescription;
            }
            walk(it.children);
        });
        walk(this.data);
        if (moved) await this.syncToFile();
        await this.plugin.saveSettings();
    }

    /**
     * 获取失效链接数量
     */
    getInvalidLinkCount() {
        const linkStatus = this.plugin.settings.linkStatus || {};
        return Object.values(linkStatus).filter(s => s.status === 'invalid').length;
    }

    /**
     * 格式化日期
     */
    formatDate(timestamp) {
        if (!timestamp) return '未知';
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * 显示右键菜单
     */
    showContextMenu(e, item, card, titleDiv, triggerBtn) {
        // 移除已存在的菜单
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'bookmark-context-menu';
        
        // 菜单项配置
        const menuItems = [
            {
                icon: 'external-link',
                text: '在新标签页打开',
                action: () => {
                    window.open(item.url, '_blank');
                }
            },
            {
                icon: 'copy',
                text: '复制链接',
                action: () => {
                    navigator.clipboard.writeText(item.url).then(() => {
                        new Notice('✅ 链接已复制');
                    }).catch(() => {
                        new Notice('❌ 复制失败');
                    });
                }
            },
            { type: 'separator' },
            {
                icon: 'pencil',
                text: '编辑标题',
                action: () => {
                    this.showEditTitleModal(item, card, titleDiv);
                }
            },
            {
                icon: 'hash',
                text: '编辑标签',
                action: () => {
                    this.showEditTagsModal(item);
                }
            },
            { type: 'separator' },
            {
                icon: 'trash-2',
                text: '删除书签',
                danger: true,
                action: () => {
                    this.showDeleteConfirm(item);
                }
            }
        ];

        // 创建菜单项
        menuItems.forEach(menuItem => {
            if (menuItem.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                menu.appendChild(separator);
            } else {
                const itemEl = document.createElement('div');
                itemEl.className = 'context-menu-item' + (menuItem.danger ? ' danger' : '');

                const iconSpan = document.createElement('span');
                iconSpan.className = 'context-menu-icon';
                setIcon(iconSpan, menuItem.icon);

                const textSpan = document.createElement('span');
                textSpan.className = 'context-menu-text';
                textSpan.textContent = menuItem.text;

                itemEl.appendChild(iconSpan);
                itemEl.appendChild(textSpan);

                itemEl.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.hideContextMenu();
                    menuItem.action();
                });

                menu.appendChild(itemEl);
            }
        });

        // 挂载到 body
        document.body.appendChild(menu);
        
        // 计算位置：基于触发按钮定位
        const btnRect = triggerBtn.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 默认显示在按钮下方偏左
        let x = btnRect.right - menuRect.width;
        let y = btnRect.bottom + 6;

        // 确保不超出右边界
        if (x < 10) {
            x = 10;
        }
        // 确保不超出下边界，如果超出则显示在按钮上方
        if (y + menuRect.height > viewportHeight - 10) {
            y = btnRect.top - menuRect.height - 6;
        }

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // 标记按钮为激活状态
        triggerBtn.classList.add('is-active');
        this.currentContextMenu = menu;
        this.currentMenuTrigger = triggerBtn;

        // 点击其他地方关闭菜单
        const closeHandler = (evt) => {
            if (!menu.contains(evt.target) && evt.target !== triggerBtn) {
                this.hideContextMenu();
            }
        };
        
        this.hideContextMenuHandler = closeHandler;
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler, true);
        }, 10);
    }

    /**
     * 隐藏右键菜单
     */
    hideContextMenu() {
        if (this.currentContextMenu) {
            this.currentContextMenu.remove();
            this.currentContextMenu = null;
        }
        if (this.currentMenuTrigger) {
            this.currentMenuTrigger.classList.remove('is-active');
            this.currentMenuTrigger = null;
        }
        if (this.hideContextMenuHandler) {
            document.removeEventListener('click', this.hideContextMenuHandler, true);
            this.hideContextMenuHandler = null;
        }
    }

    /**
     * 显示编辑标题弹窗
     */
    showEditTitleModal(item, card, titleDiv) {
        const modal = document.createElement('div');
        modal.className = 'bookmark-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'bookmark-modal';

        const header = document.createElement('div');
        header.className = 'bookmark-modal-header';
        header.textContent = '编辑标题';

        const content = document.createElement('div');
        content.className = 'bookmark-modal-content';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'bookmark-modal-input';
        input.value = item.name;
        input.placeholder = '输入新标题...';

        const buttons = document.createElement('div');
        buttons.className = 'bookmark-modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'bookmark-modal-btn cancel';
        cancelBtn.textContent = '取消';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bookmark-modal-btn save';
        saveBtn.textContent = '保存';

        // 取消
        const closeModal = () => {
            modal.remove();
        };

        cancelBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // 保存
        const saveTitle = async () => {
            const newTitle = input.value.trim();
            if (!newTitle) {
                new Notice('❌ 标题不能为空');
                return;
            }
            
            // 更新数据
            item.name = newTitle;
            
            // 更新 metadata 中的标题
            if (!this.plugin.settings.metadata[item.url]) {
                this.plugin.settings.metadata[item.url] = {};
            }
            this.plugin.settings.metadata[item.url].title = newTitle;
            await this.plugin.saveSettings();
            
            // 同步到文件
            await this.syncToFile();
            
            // 更新UI
            titleDiv.empty();
            titleDiv.createSpan({ text: newTitle });
            
            new Notice('✅ 标题已更新');
            closeModal();
        };

        saveBtn.onclick = saveTitle;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveTitle();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };

        content.appendChild(input);
        buttons.appendChild(cancelBtn);
        buttons.appendChild(saveBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(buttons);
        modal.appendChild(dialog);

        document.body.appendChild(modal);
        
        // 聚焦并选中
        input.focus();
        input.select();
    }

    /**
     * 显示编辑标签弹窗
     */
    showEditTagsModal(item) {
        const modal = document.createElement('div');
        modal.className = 'bookmark-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'bookmark-modal tags-modal';

        const header = document.createElement('div');
        header.className = 'bookmark-modal-header';
        header.textContent = '编辑标签';

        const content = document.createElement('div');
        content.className = 'bookmark-modal-content';

        // 当前标签显示区
        const currentTagsContainer = document.createElement('div');
        currentTagsContainer.className = 'current-tags-container';
        
        const currentTagsLabel = document.createElement('div');
        currentTagsLabel.className = 'tags-label';
        currentTagsLabel.textContent = '当前标签';
        currentTagsContainer.appendChild(currentTagsLabel);
        
        const currentTagsDiv = document.createElement('div');
        currentTagsDiv.className = 'current-tags';
        currentTagsContainer.appendChild(currentTagsDiv);

        // 渲染当前标签
        const renderCurrentTags = () => {
            currentTagsDiv.innerHTML = '';
            if (!item.tags || item.tags.length === 0) {
                const emptyHint = document.createElement('span');
                emptyHint.className = 'tags-empty-hint';
                emptyHint.textContent = '暂无标签';
                currentTagsDiv.appendChild(emptyHint);
            } else {
                item.tags.forEach(tag => {
                    const tagChip = document.createElement('span');
                    tagChip.className = 'editable-tag-chip';
                    tagChip.textContent = `#${tag}`;
                    
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'tag-remove-btn';
                    setIcon(removeBtn, 'x');
                    removeBtn.onclick = () => {
                        item.tags = item.tags.filter(t => t !== tag);
                        renderCurrentTags();
                    };
                    
                    tagChip.appendChild(removeBtn);
                    currentTagsDiv.appendChild(tagChip);
                });
            }
        };
        renderCurrentTags();

        // 添加新标签输入区
        const addTagContainer = document.createElement('div');
        addTagContainer.className = 'add-tag-container';
        
        const addTagLabel = document.createElement('div');
        addTagLabel.className = 'tags-label';
        addTagLabel.textContent = '添加标签';
        addTagContainer.appendChild(addTagLabel);
        
        const inputRow = document.createElement('div');
        inputRow.className = 'tag-input-row';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'bookmark-modal-input tag-input';
        input.placeholder = '输入标签名（无需#号）...';
        
        const addBtn = document.createElement('button');
        addBtn.className = 'tag-add-btn';
        addBtn.textContent = '添加';
        
        const addTag = () => {
            const tagName = input.value.trim().replace(/^#/, '');
            if (!tagName) return;
            
            if (!item.tags) item.tags = [];
            if (item.tags.includes(tagName)) {
                new Notice('标签已存在');
                return;
            }
            
            item.tags.push(tagName);
            input.value = '';
            renderCurrentTags();
            renderSuggestions();
        };
        
        addBtn.onclick = addTag;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        };
        
        inputRow.appendChild(input);
        inputRow.appendChild(addBtn);
        addTagContainer.appendChild(inputRow);

        // 建议标签区（从已有标签中选择）
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'tag-suggestions-container';
        
        const suggestionsLabel = document.createElement('div');
        suggestionsLabel.className = 'tags-label';
        suggestionsLabel.textContent = '可选标签';
        suggestionsContainer.appendChild(suggestionsLabel);
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'tag-suggestions';
        suggestionsContainer.appendChild(suggestionsDiv);

        const renderSuggestions = () => {
            suggestionsDiv.innerHTML = '';
            const availableTags = this.allTags.filter(t => !item.tags || !item.tags.includes(t.name));
            
            if (availableTags.length === 0) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            suggestionsContainer.style.display = 'block';
            availableTags.slice(0, 15).forEach(tag => {
                const tagChip = document.createElement('span');
                tagChip.className = 'suggestion-tag-chip';
                tagChip.textContent = `#${tag.name}`;
                tagChip.onclick = () => {
                    if (!item.tags) item.tags = [];
                    item.tags.push(tag.name);
                    renderCurrentTags();
                    renderSuggestions();
                };
                suggestionsDiv.appendChild(tagChip);
            });
        };
        renderSuggestions();

        // 按钮区
        const buttons = document.createElement('div');
        buttons.className = 'bookmark-modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'bookmark-modal-btn cancel';
        cancelBtn.textContent = '取消';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bookmark-modal-btn save';
        saveBtn.textContent = '保存';

        const closeModal = () => {
            modal.remove();
        };

        cancelBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        saveBtn.onclick = async () => {
            // 同步到文件
            await this.syncToFile();
            
            new Notice('✅ 标签已更新');
            closeModal();
            
            // 重新渲染
            const container = this.containerEl.children[1];
            this.loadAndRender(container);
        };

        content.appendChild(currentTagsContainer);
        content.appendChild(addTagContainer);
        content.appendChild(suggestionsContainer);
        buttons.appendChild(cancelBtn);
        buttons.appendChild(saveBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(buttons);
        modal.appendChild(dialog);

        document.body.appendChild(modal);
        
        input.focus();
    }

    /**
     * 显示删除确认弹窗
     */
    showDeleteConfirm(item) {
        const modal = document.createElement('div');
        modal.className = 'bookmark-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'bookmark-modal';

        const header = document.createElement('div');
        header.className = 'bookmark-modal-header';
        header.textContent = '删除书签';

        const content = document.createElement('div');
        content.className = 'bookmark-modal-content';
        
        const message = document.createElement('p');
        message.className = 'bookmark-modal-message';
        message.textContent = `确定要删除「${item.name}」吗？`;
        
        const hint = document.createElement('p');
        hint.className = 'bookmark-modal-hint';
        hint.textContent = '此操作将从书签文件中移除该链接';

        const buttons = document.createElement('div');
        buttons.className = 'bookmark-modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'bookmark-modal-btn cancel';
        cancelBtn.textContent = '取消';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bookmark-modal-btn danger';
        deleteBtn.textContent = '删除';

        const closeModal = () => {
            modal.remove();
        };

        cancelBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        deleteBtn.onclick = async () => {
            await this.deleteBookmark(item);
            closeModal();
        };

        content.appendChild(message);
        content.appendChild(hint);
        buttons.appendChild(cancelBtn);
        buttons.appendChild(deleteBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(buttons);
        modal.appendChild(dialog);

        document.body.appendChild(modal);
    }

    /**
     * 删除书签
     */
    async deleteBookmark(item) {
        // 从数据中删除
        const removeBookmark = (items, url) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === 'bookmark' && items[i].url === url) {
                    items.splice(i, 1);
                    return true;
                }
                if (items[i].type === 'folder' && items[i].children) {
                    if (removeBookmark(items[i].children, url)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (removeBookmark(this.data, item.url)) {
            // 同步到文件
            await this.syncToFile();
            
            // 删除元数据
            if (this.plugin.settings.metadata[item.url]) {
                delete this.plugin.settings.metadata[item.url];
            }
            // 删除链接状态
            if (this.plugin.settings.linkStatus[item.url]) {
                delete this.plugin.settings.linkStatus[item.url];
            }
            await this.plugin.saveSettings();
            
            // 重新渲染
            const container = this.containerEl.children[1];
            this.loadAndRender(container);
            
            new Notice('✅ 书签已删除');
        } else {
            new Notice('❌ 删除失败');
        }
    }

    /**
     * 检测所有链接
     */
    async checkAllLinks(container) {
        this.isCheckingLinks = true;
        
        // 收集所有书签 URL
        const urls = [];
        const collectUrls = (items) => {
            items.forEach(item => {
                if (item.type === 'bookmark' && item.url) {
                    urls.push(item.url);
                }
                if (item.children) {
                    collectUrls(item.children);
                }
            });
        };
        collectUrls(this.data);

        if (urls.length === 0) {
            new Notice('没有找到书签');
            this.isCheckingLinks = false;
            return;
        }

        // 创建进度提示
        const total = urls.length;
        let checked = 0;
        let validCount = 0;
        let invalidCount = 0;

        new Notice(`🔍 开始检测 ${total} 个链接...`);

        // 批量检测（每批5个，避免过多并发）
        const batchSize = 5;
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (url) => {
                const isValid = await this.checkSingleLink(url);
                checked++;
                if (isValid) {
                    validCount++;
                } else {
                    invalidCount++;
                }
            }));

            // 更新进度
            if (checked % 10 === 0 || checked === total) {
                new Notice(`检测进度: ${checked}/${total}`);
            }
        }

        this.isCheckingLinks = false;
        
        // 显示结果
        new Notice(`✅ 检测完成!\n正常: ${validCount} | 失效: ${invalidCount}`);
        
        // 重新渲染以更新状态
        this.loadAndRender(container);
    }

    /**
     * 检测单个链接
     */
    async checkSingleLink(url) {
        if (!url || !url.startsWith('http')) {
            return false;
        }

        try {
            // 使用 HEAD 请求检测（更快）
            const response = await requestUrl({
                url: url,
                method: 'HEAD',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                throw: false
            });

            // 状态码 2xx 和 3xx 认为是有效的
            const isValid = response.status >= 200 && response.status < 400;
            
            // 保存状态
            await this.saveLinkStatus(url, isValid ? 'valid' : 'invalid');
            
            return isValid;
        } catch (e) {
            // 如果 HEAD 请求失败，尝试 GET 请求
            try {
                const response = await requestUrl({
                    url: url,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    throw: false
                });

                const isValid = response.status >= 200 && response.status < 400;
                await this.saveLinkStatus(url, isValid ? 'valid' : 'invalid');
                return isValid;
            } catch (e2) {
                // 网络错误或其他问题，标记为失效
                await this.saveLinkStatus(url, 'invalid');
                return false;
            }
        }
    }

    /**
     * 保存链接状态
     */
    async saveLinkStatus(url, status) {
        if (!this.plugin.settings.linkStatus) {
            this.plugin.settings.linkStatus = {};
        }
        
        this.plugin.settings.linkStatus[url] = {
            status: status,
            lastCheck: Date.now()
        };
        
        await this.plugin.saveSettings();
    }

    /**
     * 检查链接是否需要重新检测
     */
    needsRecheck(url) {
        const linkStatus = this.plugin.settings.linkStatus[url];
        if (!linkStatus) return true;
        
        const intervalDays = this.plugin.settings.linkCheckInterval || 7;
        const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
        
        return (Date.now() - linkStatus.lastCheck) > intervalMs;
    }

    async onClose() {
        // cleanup
    }
}

class BookmarkCardsPlugin extends Plugin {
    async onload() {
        console.log('Loading Bookmark Cards Plugin');
        await this.loadSettings();

        // Register Icon First
        this.addRibbonIcon('book', '打开书签收藏盒', () => {
            this.activateView();
        });

        this.registerView(
            VIEW_TYPE_BOOKMARK_CARDS,
            (leaf) => new BookmarkCardsView(leaf, this)
        );

        this.addSettingTab(new BookmarkCardsSettingTab(this.app, this));
    }

    async onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_BOOKMARK_CARDS);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        // Migration: Force update if user is on the old default Unsplash URL
        const OLD_DEFAULT_URL = 'https://images.unsplash.com/photo-1481487484168-9b9322a818c9?w=800&auto=format&fit=crop&q=60';
        if (this.settings.defaultImage === OLD_DEFAULT_URL) {
            this.settings.defaultImage = DEFAULT_COVER_SVG;
            await this.saveSettings();
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_BOOKMARK_CARDS);
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE_BOOKMARK_CARDS,
            active: true,
        });
    }
}

class BookmarkCardsSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '书签卡片设置' });

        new Setting(containerEl)
            .setName('书签文件路径')
            .setDesc('设置存放书签的 Markdown 文件位置，如：我的文件夹/书签.md')
            .addText(text => text
                .setPlaceholder('Example/Path/To/File.md')
                .setValue(this.plugin.settings.bookmarkFilePath)
                .onChange(async (value) => {
                    this.plugin.settings.bookmarkFilePath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('列表视图')
            .setDesc('启用后可在工具栏切换到列表布局')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableList)
                .onChange(async (value) => {
                    this.plugin.settings.enableList = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('卡片视图')
            .setDesc('启用后可在工具栏切换到卡片布局')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableGrid)
                .onChange(async (value) => {
                    this.plugin.settings.enableGrid = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('表格视图')
            .setDesc('启用后可在工具栏切换到表格布局，支持排序和批量管理')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableTable)
                .onChange(async (value) => {
                    this.plugin.settings.enableTable = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('默认封面')
            .setDesc('无法获取网站图片时显示的备用图片，可使用内置图片或填入自定义图片链接')
            .addText(text => text
                .setPlaceholder('https://...')
                .setValue(this.plugin.settings.defaultImage)
                .onChange(async (value) => {
                    this.plugin.settings.defaultImage = value;
                    await this.plugin.saveSettings();
                }));

        // Screenshot API Settings Section
        containerEl.createEl('h3', { text: '截图 API 设置' });
        containerEl.createEl('p', { 
            text: '当网站未提供预览图时，可通过截图服务自动生成。若截图也失败，将显示网站图标作为替代。',
            cls: 'setting-item-description'
        });

        new Setting(containerEl)
            .setName('截图服务')
            .setDesc('选择用于生成网页预览图的服务商')
            .addDropdown(dropdown => dropdown
                .addOption('none', '不使用')
                .addOption('thum', 'Thum.io（免费）')
                .addOption('pagepeeker', 'PagePeeker（免费）')
                .addOption('microlink', 'Microlink（免费，有调用限制）')
                .addOption('screenshotmachine', 'Screenshot Machine（需要密钥）')
                .addOption('custom', '自定义 API (Custom)')
                .setValue(this.plugin.settings.screenshotApi)
                .onChange(async (value) => {
                    this.plugin.settings.screenshotApi = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show/hide API key field
                }));

        // Show API key field only for screenshotmachine
        if (this.plugin.settings.screenshotApi === 'screenshotmachine') {
            new Setting(containerEl)
                .setName('API 密钥')
                .setDesc('填入 Screenshot Machine 提供的密钥')
                .addText(text => text
                    .setPlaceholder('your-api-key')
                    .setValue(this.plugin.settings.screenshotApiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.screenshotApiKey = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // Show custom API template field
        if (this.plugin.settings.screenshotApi === 'custom') {
            new Setting(containerEl)
                .setName('自定义接口地址')
                .setDesc('用 {url} 表示网址位置，如：https://api.example.com/shot?url={url}')
                .addText(text => text
                    .setPlaceholder('https://api.example.com/screenshot?url={url}')
                    .setValue(this.plugin.settings.customScreenshotApi)
                    .onChange(async (value) => {
                        this.plugin.settings.customScreenshotApi = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // Link Validation Settings Section
        containerEl.createEl('h3', { text: '链接检测' });

        new Setting(containerEl)
            .setName('启用链接检测')
            .setDesc('自动检查书签是否可以正常访问，失效链接会被标记提醒')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableLinkValidation)
                .onChange(async (value) => {
                    this.plugin.settings.enableLinkValidation = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('检测周期')
            .setDesc('每隔多少天重新检测一次链接状态')
            .addSlider(slider => slider
                .setLimits(1, 30, 1)
                .setValue(this.plugin.settings.linkCheckInterval)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.linkCheckInterval = value;
                    await this.plugin.saveSettings();
                }));

        // 显示失效链接统计
        const linkStatus = this.plugin.settings.linkStatus || {};
        const totalChecked = Object.keys(linkStatus).length;
        const invalidCount = Object.values(linkStatus).filter(s => s.status === 'invalid').length;
        const validCount = Object.values(linkStatus).filter(s => s.status === 'valid').length;

        if (totalChecked > 0) {
            const statsEl = containerEl.createDiv({ cls: 'link-stats-container' });
            statsEl.createEl('p', { 
                text: `📊 已检测 ${totalChecked} 个链接`,
                cls: 'link-stats-title'
            });
            statsEl.createEl('p', { 
                text: `✅ 正常 ${validCount} 个 · ⚠️ 失效 ${invalidCount} 个`,
                cls: 'link-stats-detail'
            });
            
            // 清除检测记录按钮
            new Setting(containerEl)
                .setName('重置检测记录')
                .setDesc('清空所有检测结果，之后将重新检测所有链接')
                .addButton(button => button
                    .setButtonText('重置')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.linkStatus = {};
                        await this.plugin.saveSettings();
                        new Notice('✅ 检测记录已重置');
                        this.display();
                    }));
        }

        // 标签设置
        containerEl.createEl('h3', { text: '标签功能' });
        containerEl.createEl('p', { 
            text: '标签功能与 Obsidian 标签系统打通，支持在书签中使用 #tag 格式添加标签。',
            cls: 'setting-item-description'
        });

        new Setting(containerEl)
            .setName('启用标签功能')
            .setDesc('开启后可以为书签添加标签，并通过标签筛选书签')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableTags)
                .onChange(async (value) => {
                    this.plugin.settings.enableTags = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('标签显示模式')
            .setDesc('选择标签在界面上的显示方式')
            .addDropdown(dropdown => dropdown
                .addOption('card', '仅在卡片上显示')
                .addOption('filter', '仅在筛选器中显示')
                .addOption('both', '卡片和筛选器都显示')
                .setValue(this.plugin.settings.tagDisplayMode || 'card')
                .onChange(async (value) => {
                    this.plugin.settings.tagDisplayMode = value;
                    await this.plugin.saveSettings();
                }));
    }
}

module.exports = BookmarkCardsPlugin;
