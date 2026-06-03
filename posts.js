// ===== NPL 사이트 포스팅 DB (localStorage) =====
// 모든 페이지에서 공유하는 게시글 데이터 관리 라이브러리

const PostsDB = (function () {
  const STORAGE_KEY = 'npl_posts';

  const CATEGORIES = {
    'npl-intro':   { name: 'NPL이란?',       page: 'npl-intro.html' },
    'npl-invest':  { name: 'NPL 투자 방법',   page: 'npl-invest.html' },
    'office-buy':  { name: '사옥·건물 취득', page: 'office-buy.html' },
    'store-buy':   { name: '매장·상가 취득', page: 'store-buy.html' }
  };

  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function _save(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function _slug(title) {
    return title
      .replace(/\s+/g, '-')
      .replace(/[^\wㄱ-힝-]/g, '')
      .toLowerCase()
      .slice(0, 60);
  }

  function _formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  }

  return {
    CATEGORIES,

    getAll() { return _load(); },

    getByCategory(cat) {
      return _load().filter(p => p.category === cat);
    },

    getPublished(cat) {
      const all = cat ? this.getByCategory(cat) : _load();
      return all.filter(p => p.status === 'published')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getById(id) {
      return _load().find(p => p.id === id) || null;
    },

    create(data) {
      const posts = _load();
      const now = new Date().toISOString();
      const post = {
        id: Date.now().toString() + Math.random().toString(36).slice(2,6),
        category: data.category,
        title: data.title || '제목 없음',
        slug: _slug(data.title || ''),
        metaDescription: data.metaDescription || '',
        content: data.content || '',
        status: data.status || 'draft',
        createdAt: now,
        updatedAt: now
      };
      posts.unshift(post);
      _save(posts);
      return post;
    },

    update(id, data) {
      const posts = _load();
      const idx = posts.findIndex(p => p.id === id);
      if (idx < 0) return null;
      posts[idx] = {
        ...posts[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      if (data.title) posts[idx].slug = _slug(data.title);
      _save(posts);
      return posts[idx];
    },

    delete(id) {
      _save(_load().filter(p => p.id !== id));
    },

    formatDate: _formatDate,

    exportJSON() {
      return JSON.stringify(_load(), null, 2);
    },

    importJSON(jsonString) {
      const posts = JSON.parse(jsonString);
      if (!Array.isArray(posts)) throw new Error('Invalid format');
      _save(posts);
      return posts.length;
    },

    stats() {
      const all = _load();
      const result = {};
      Object.keys(CATEGORIES).forEach(cat => {
        const catPosts = all.filter(p => p.category === cat);
        result[cat] = {
          total: catPosts.length,
          published: catPosts.filter(p => p.status === 'published').length,
          draft: catPosts.filter(p => p.status === 'draft').length
        };
      });
      return result;
    }
  };
})();

// ===== 카테고리 페이지 동적 포스트 로더 =====
// 각 카테고리 페이지에서 호출: PostsDB.renderPosts('npl-intro', 'article-list')
PostsDB.renderPosts = function (category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = PostsDB.getPublished(category);
  if (posts.length === 0) return;

  // 구분선 추가
  const divider = document.createElement('div');
  divider.className = 'article-hub-title';
  divider.style.marginTop = '32px';
  divider.innerHTML = '📝 최신 포스팅';
  container.parentNode.insertBefore(divider, container);

  const newList = document.createElement('div');
  newList.className = 'article-list';
  newList.style.marginBottom = '32px';

  posts.forEach(post => {
    const item = document.createElement('a');
    item.href = `post.html?id=${post.id}`;
    item.className = 'article-item';
    item.style.textDecoration = 'none';
    item.innerHTML = `
      <div>
        <h4>${post.title}</h4>
        <p>${post.metaDescription ? post.metaDescription.slice(0, 80) + '…' : ''}</p>
      </div>
      <span class="article-badge new">${PostsDB.formatDate(post.createdAt)}</span>
    `;
    newList.appendChild(item);
  });

  container.parentNode.insertBefore(newList, container);
};
