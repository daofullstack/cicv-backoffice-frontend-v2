<template>
  <DataTable :table="table" ref="colisTrackerTable" />
</template>

<script>
import DataTable from "../../../components/helpers/DataTable";
import { updateOne } from "../../../api/colisTrackerManagement/colis_tracker";

export default {
  components: { DataTable },
  data() {
    return {
      table: {
        title: "Pending Users 2  Table",
        toolbar: {
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
              fieldName: "firstName",
              label: "First Name",
              value: "",
            },
            {
              type: "input",
              fieldName: "lastName",
              label: "Last Name",
              value: "",
            },
            {
              type: "input",
              fieldName: "username",
              label: "Username",
              value: "",
            },
            {
              type: "input",
              fieldName: "email",
              label: "Email",
              value: "",
            },
            {
              type: "select",
              options: ["Admin", "User", "Guest"],
              fieldName: "role.name",
              label: "Role",
              value: "",
            },
          ],
          topRightButtons: [
            {
              text: "Activate Users",
              icon: "check",
              isVisible: () => this.hasAccess(["admin"]),
              action: () => {
                this.activateSelected();
              },
            },
          ],
        },
        filters: {
          isPending: true,
        },
        settings: {
          url: "users/table",
          isServerSide: true,
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rowsPerPage: 25,
          },
        },
        headers: [
          { text: "Name", align: "left" },
          { text: "Username" },
          { text: "Email" },
          { text: "Role" },
          { text: "Created At" },
        ],
        contents: [
          {
            data: "firstName",
            render: (data, full) => {
              return `${data} ${full.lastName || ""}`;
            },
          },
          { data: "username" },
          {
            data: "email",
            render: (data) => {
              return `<button type="button" class="warning--text text-lowercase theme--dark v-btn v-btn--depressed v-btn--outline v-btn--round v-btn--small">
                    <div class="v-btn__content">${data}</div>
                  </button>`;
            },
            getRecord: (data) => {
              alert(`Column action. Get row data, email: ${data.email}`);
            },
          },
          { data: "role.name" },
          { data: "role.level", hideColumn: true },
          {
            data: "createdAt",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY H:mm z");
            },
          },
          { data: "lastName", hideColumn: true },
        ],
        actions: [
          {
            text: "Activate User",
            icon: "check",
            color: "green",
            isVisible: (data) => data.role.level > -1 && this.hasAccess(["admin"]),
            getRecord: async (data) => {
              await this.activateUser(data._id);
            },
          },
        ],
      },
    };
  },
  methods: {
    async activateUser(id) {
      const body = {
        _id: id,
        isActive: true,
        isPending: false,
      };
      const activate = await this.$root.$confirm(
        "Activate?",
        "Êtes-vous sûr de vouloir activer cet utilisateur ?",
        { color: "success lighten-1" }
      );
      try {
        if (activate) {
          this.$root.$dialogLoader.show("Veuillez patienter svp...", { color: "primary" });
          await updateOne(body);
          this.$root.$dialogLoader.hide();
          this.$refs.colisTrackerTable.refreshTable();
          this.$snotify.success("Utilisateur activé", "Success");
        }
      } catch (error) {
        this.$snotify.error("Échec de l'activation de l'utilisateur !", "Error");
        this.$root.$dialogLoader.hide();
      }
    },
    async archiveSelected() {
      const datas = JSON.parse(JSON.stringify(this.table.selected));
      const filtered = datas.filter((data) => !this.isSelf(data));
      if (filtered.length < 1)
        return this.$snotify.error("Veuillez sélectionner des données autres que vous-même", "Error");
      const del = await this.$root.$confirm(
        "Archiver?",
        "Êtes-vous sûr de vouloir archiver les données sélectionnées ?",
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
          this.$refs.colisTable.refreshTable();
          this.$snotify.success("Données sélectionnées archivées", "Success");
        }
      } catch (error) {
        this.$snotify.error("Données sélectionnées archivées", "Error");
        this.$root.$dialogLoader.hide();
      }
    },
  },
};
</script>
