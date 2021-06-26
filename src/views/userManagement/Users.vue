<template>
  <div class="page-layout">
    <g-breadcrumbs :items="breadcrumbs" />
    <v-tabs class="g-tabs" slider-color="primary">
      <v-tab :to="{name: 'usersTable'}">Users</v-tab>
      <v-tab v-if="hasPermission('usersPending')" :to="{name: 'usersPending'}">Pending Users</v-tab>
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
          href: "#"
        },
        {
          text: "Users",
          disabled: false,
          href: "#"
        }
      ]
      // =================
    };
  },
  mounted() {},
  methods: {}
};
</script>