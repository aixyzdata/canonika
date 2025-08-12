<template>
  <div id="app">
    <!-- Header -->
    <header class="canonika-header py-3">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="h3 mb-0">
              <i class="fas fa-ship me-2"></i>
              Skipper
            </h1>
            <p class="mb-0 text-light">Orquestrador de Navegação e Extração</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="d-flex justify-content-end align-items-center">
              <span class="badge bg-success me-3">
                <i class="fas fa-circle me-1"></i>
                Online
              </span>
              <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user me-1"></i>
                  Usuário
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Configurações</a></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 d-md-block canonika-sidebar sidebar">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/simulation" class="nav-link text-light">
                  <i class="fas fa-search me-2"></i>
                  Simulação
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/sources" class="nav-link text-light">
                  <i class="fas fa-database me-2"></i>
                  Fontes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard" class="nav-link text-light">
                  <i class="fas fa-chart-bar me-2"></i>
                  Dashboard
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="pt-3 pb-2 mb-3">
            <router-view></router-view>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

