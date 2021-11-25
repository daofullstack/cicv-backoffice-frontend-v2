<template>
  <div>
    <DataTable :table="table" ref="colisTrackerTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateOne } from "../../../api/colisTrackerManagement/colis_tracker";
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
        title: "Liste des types de colis",
        filters: {},
        settings: {
          url: "colistracker/table",
          isServerSide: true,
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rowsPerPage: 25,
          },
        },
        toolbar: {
          archivedTableSwitcher: true,
          search: true,
          selectAll: true,
          exportButtons: true,
          daterange: {
            display: false,
            fieldName: "createdAt",
          },
          topRightButtons: [
            {
              text: "Ajouter type de Colis",
              icon: "add",
              isVisible: () => this.hasAccess(["write", "admin"]),
              action: () => {
                this.$router.push({ name: "colisTypeAdd" });
              },
            },
            {
              groupName: "moreActions",
              text: "Archive Selected",
              icon: "clear_all",
              isVisible: () => this.hasAccess(["admin"]),
              action: () => {
                this.archiveSelected();
              },
            },
          ],
          filters: [
            {
              type: "trackNumber",
              fieldName: "name",
              label: "name",
              value: "",
            },
            {
              type: "input",
              fieldName: "name",
              label: "name",
              value: "",
            },
            {
              type: "input",
              fieldName: "description",
              label: "description",
              value: "",
            },

            {
              type: "input",
              fieldName: "status",
              label: "status",
              value: "",
            },

            {
              type: "input",
              fieldName: "provider",
              label: "provider",
              value: "",
            },
            {
              type: "input",
              fieldName: "isActive",
              label: "isActive",
              value: "",
            },
          ],
        },

        headers: [
          { text: "N° de colis" },
          { text: "Nom", align: "left" },
          { text: "Description" },
          { text: "Status" },
          { text: "Fournisseur" },
          { text: "Crée le" },
        ],
        contents: [
          { data: "trackNumber" },
          {
            data: "name",
          },
          { data: "description" },

          { data: "status" },

          { data: "provider" },
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
            isVisible: () => this.hasAccess(["read", "write", "admin"]),
            getRecord: (data) => {
              this.$router.push({ name: "colisTypeEdit", params: { id: data._id } });
            },
          },
          {
            text: "Suprimmer les données",
            icon: "delete",
            color: "red accent-2",
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const archived = await archiveItem(this, "colistype", data._id);
              if (archived) this.$refs.colisTrackerTable.refreshTable();
            },
          },
          {
            text: "Activer les données",
            icon: "check",
            color: "green",
            showInArchived: true,
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const activated = await activateItem(this, "colistype", data._id);
              if (activated) this.$refs.colisTrackerTable.refreshTable();
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
     * Archive selected datas
     */
    async archiveSelected() {
      const datas = JSON.parse(JSON.stringify(this.table.selected));
      const filtered = datas.filter((data) => !this.isSelf(data));
      if (filtered.length < 1)
        return this.$snotify.error("Veuillez sélectionner des données autres que vous-même", "Erreur");
      const del = await this.$root.$confirm(
        "Archiver?",
        "Êtes-vous sûr de vouloir archiver les données sélectionnées?",
        { color: "error lighten-1" }
      );
      try {
        if (del) {
          this.$root.$dialogLoader.show("Veuillez patienter svp...", { color: "primary" });
          const archiveUsers = filtered.map((data) => {
            return updateOne({
              _id: data._id,
              isActive: false,
            });
          });
          await Promise.all(archiveUsers);
          this.$root.$dialogLoader.hide();
          this.$refs.colisTrackerTable.refreshTable();
          this.$snotify.success("Données sélectionnées archivées", "Succès");
        }
      } catch (error) {
        this.$snotify.error("Échec de l'archivage des données !", "Erreur");
        this.$root.$dialogLoader.hide();
      }
    },
  },
};
</script>
