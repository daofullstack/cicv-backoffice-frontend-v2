<template>
  <div class="page-layout">
    <g-breadcrumbs :items="breadcrumbs" />
    <v-tabs class="g-tabs" slider-color="primary">
      <v-tab :to="{ name: 'colisTrackerTable' }">Colis</v-tab>
      <v-tab
        v-if="hasPermission('colisTrackerPending')"
        :to="{ name: 'colisTrackerPending' }"
        >Colis Tracker en attente</v-tab
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
          text: "Colis Tracker",
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
