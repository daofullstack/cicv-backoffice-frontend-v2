<template>
  <div class="page-layout">
    <g-breadcrumbs :items="breadcrumbs" />
    <v-tabs class="g-tabs" slider-color="primary">
      <v-tab :to="{ name: 'warehouseTable' }">Warehouse</v-tab>
      <v-tab v-if="hasPermission('warehousePending')" :to="{ name: 'warehousePending' }"
        >Warehouse en attente</v-tab
      >
    </v-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Breadcrumbs
      breadcrumbs: [
        {
          text: "Dashboard",
          disabled: false,
          href: "#",
        },
        {
          text: "Warehouse",
          disabled: true,
          href: "#",
        },
      ],
      // =================
    };
  },
  mounted() {},
  methods: {},
};
</script>
