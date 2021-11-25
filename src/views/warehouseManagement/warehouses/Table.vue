<template>
  <div>
    <DataTable :table="table" ref="warehouseTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateOne } from "../../../api/warehouseManagement/warehouses";
import { archiveItem, activateItem } from "../../../components/helpers/jsUtills/jsAction";
import DataTable from "../../../components/helpers/DataTable";

export default {
  components: { DataTable },
  data() {
    return {
      /**
       * Datatable required properties.
       * Please open the documentation file for more info and usage.
       */
      table: {
        title: "warehouses Table",
        toolbar: {
          archivedTableSwitcher: true,
          search: true,
          selectAll: true,
          exportButtons: true,
          daterange: {
            display: false,
            fieldName: "createdAt",
          },
          filters: [
            {
              type: "input",
              fieldName: "name",
              label: " Name",
              value: "",
            },
            {
              type: "input",
              fieldName: "location",
              label: "Location",
              value: "",
            },
            {
              type: "input",
              fieldName: "description",
              label: "Description",
              value: "",
            },
          ],
          topRightButtons: [
            {
              text: "Ajouter un entrepôt",
              icon: "add",
              isVisible: () => this.hasAccess(["write", "admin"]),
              action: () => {
                this.$router.push({ name: "warehouseAdd" });
              },
            },
            {
              groupName: "moreActions",
              text: "Archiver les données sélectionnées",
              icon: "clear_all",
              isVisible: () => this.hasAccess(["admin"]),
              action: () => {
                this.archiveSelected();
              },
            },
            {
              groupName: "moreActions",
              text: "Attribuer une autorisation",
              icon: "lock",
              isVisible: () => this.hasAccess(["admin"]),
              action: () => {
                this.openRolesModal();
              },
            },
          ],
        },
        filters: {
          //isPending: false,
        },
        settings: {
          url: "warehouse/table",
          isServerSide: true,
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rowsPerPage: 25,
          },
        },
        headers: [
          { text: "Nom", align: "left" },
          { text: "Emplacement" },
          { text: "Description" },

          { text: "Crée le" },
        ],
        contents: [
          {
            data: "name",
          },
          { data: "location" },
          {
            data: "description",
          },
          { data: "role.name" },
          { data: "role.level", hideColumn: true },
          { data: "role._id", hideColumn: true },
          {
            data: "createdAt",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY H:mm z");
            },
          },
        ],
        actions: [
          {
            text: "Afficher ou modifier",
            icon: "mdi-lead-pencil",
            color: "teal lighten-2",
            isVisible: (data) =>
              this.hasAccess(["read", "write", "admin"]) && !this.isSelf(data),
            getRecord: (data) => {
              this.$router.push({ name: "warehouseEdit2", params: { id: data._id } });
            },
          },
          {
            text: "Suprimmer les données",
            icon: "delete",
            color: "red accent-2",
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const archived = await archiveItem(this, "warehouse", data._id);
              if (archived) this.$refs.warehouseTable.refreshTable();
            },
          },
          {
            text: "Activer les données",
            icon: "check",
            color: "green",
            showInArchived: true,
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const activated = await activateItem(this, "warehouse", data._id);
              if (activated) this.$refs.warehouseTable.refreshTable();
            },
          },
        ],
      },
      selectedUsers: [],
      isModalOpen: false,
      loading: false,
    };
  },
  computed: {
    /**
     * Import getters helper from Vuex
     */
    ...mapGetters({ user: "user/profile" }),
  },
  methods: {
    /**
     * Check if user
     */
    isSelf(data) {
      return data._id == this.user._id;
    },
    /**
     * Open roles modal and send selected warehouse to roles modal component
     */
    openRolesModal() {
      const users = JSON.parse(JSON.stringify(this.table.selected));
      const filtered = users.filter((user) => !this.isSelf(user));
      if (filtered.length < 1)
        return this.$snotify.error("Veuillez sélectionner des utilisateurs autres que vous", "Erreur");
      this.selectedUsers = filtered;
      this.isModalOpen = true;
    },
    /**
     * Archive selected users
     */
    async archiveSelected() {
      const users = JSON.parse(JSON.stringify(this.table.selected));
      const filtered = users.filter((user) => !this.isSelf(user));
      if (filtered.length < 1)
        return this.$snotify.error("Veuillez sélectionner des données", "Erreur");
      const del = await this.$root.$confirm(
        "Archiver?",
        "Êtes-vous sûr de vouloir archiver les utilisateurs sélectionnés?",
        { color: "error lighten-1" }
      );
      try {
        if (del) {
          this.$root.$dialogLoader.show("S'il vous plaît, attendez...", { color: "primary" });
          const archiveUsers = filtered.map((user) => {
            return updateOne({
              _id: user._id,
              isActive: false,
            });
          });
          await Promise.all(archiveUsers);
          this.$root.$dialogLoader.hide();
          this.$refs.warehouseTable.refreshTable();
          this.$snotify.success("Entrepôts sélectionnés archivés", "Succès");
        }
      } catch (error) {
        this.$snotify.error("Échec de l'archivage de l'utilisateur!", "Erreur");
        this.$root.$dialogLoader.hide();
      }
    },
  },
};
</script>
