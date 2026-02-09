<template>
  <nav class="nav-menu">
    <div class="nav-container">
      <div class="nav-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="brand-icon"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="brand-text">Gestor de Archivos</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">
          <span class="link-icon">🔍</span>
          <span>VueFinder</span>
        </router-link>
        <router-link to="/file-manager" class="nav-link" active-class="active">
          <span class="link-icon">📊</span>
          <span>Element Plus</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Componente de navegación
</script>

<style scoped>
.nav-menu {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  width: 100%;
  box-sizing: border-box;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  flex-shrink: 0;
}

.brand-icon {
  width: 28px;
  height: 28px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.link-icon {
  font-size: 16px;
  line-height: 1;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .nav-brand {
    width: 100%;
    justify-content: center;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
    font-size: 13px;
    padding: 10px 16px;
  }

  .brand-text {
    font-size: 18px;
  }
}
</style>
