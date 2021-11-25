<template>
  <div>
    <DataTable :table="table" ref="colisTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateOne } from "../../../api/colisManagement/colis";
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
        title: "Colis Table",
        filters: { isActive: true },
        settings: {
          url: "colis/table",
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
              text: "Ajouter colis",
              icon: "add",
              isVisible: () => this.hasAccess(["write", "admin"]),
              action: () => {
                this.$router.push({ name: "colisAdd" });
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
          ],
          filters: [
            {
              type: "input",
              fieldName: "name",
              label: "name",
              value: "",
            },
            {
              type: "input",
              fieldName: "track_number",
              label: "track_number",
              value: "",
            },
            {
              type: "input",
              fieldName: "withdrawal_code",
              label: "withdrawal_code",
              value: "",
            },
            {
              type: "input",
              fieldName: "transaction_ID",
              label: "transaction_ID",
              value: "",
            },
            {
              type: "input",
              fieldName: "payment_status",
              label: "payment_status",
              value: "",
            },
            {
              type: "input",
              fieldName: "departure_customer_ID",
              label: "departure_customer_ID",
              value: "",
            },
            {
              type: "input",
              fieldName: "arrival_customer_ID",
              label: "arrival_customer_ID",
              value: "",
            },
            {
              type: "input",
              fieldName: "transaction_status",
              label: "transaction_status",
              value: "",
            },
            {
              type: "input",
              fieldName: "delivery",
              label: "delivery",
              value: "",
            },
            {
              type: "input",
              fieldName: "delivery_place",
              label: "delivery_place",
              value: "",
            },
            {
              type: "input",
              fieldName: "delivery_date",
              label: "delivery_date",
              value: "",
            },
            {
              type: "input",
              fieldName: "delivery_startTime",
              label: "delivery_startTime",
              value: "",
            },
            {
              type: "input",
              fieldName: "delivery_endTime",
              label: "delivery_endTime",
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
              fieldName: "isActive",
              label: "isActive",
              value: "",
            },
            {
              type: "input",
              fieldName: "createdAt",
              label: "Created At",
              value: "",
            },
          ],
        },

        headers: [
          { text: "Nom" },
          { text: "Numéro de suivi" },
          { text: "Code de retrait" },
          { text: "ID Transaction" },
          { text: "Statut de paiement" },

          { text: "ID client de départ" },
          { text: "ID client à arrivé" },
          { text: "Statut de la transaction" },
          { text: "Livraison" },
          { text: "Adresse de livraison" },
          { text: "Date de livraison" },
          { text: "Heure de début de la livraison" },
          { text: "Heure de fin de la livraison" },
          { text: "Description" },
          { text: "Est actif" },
          { text: "Créé le" },
        ],
        contents: [
          { data: "name" },
          { data: "track_number" },
          { data: "withdrawal_code" },
          { data: "transaction_ID" },
          { data: "payment_status" },

          { data: "departure_customer_ID" },
          { data: "arrival_customer_ID" },
          { data: "transaction_status" },
          { data: "delivery" },
          { data: "delivery_place" },
          {
            data: "delivery_date",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY H:mm z");
            },
          },
          { data: "delivery_startTime" },
          { data: "delivery_endTime" },
          { data: "description" },
          { data: "isActive" },
          {
            data: "crée le",
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
              this.$router.push({ name: "colisEdit", params: { id: data._id } });
            },
          },
          {
            text: "Suprimmer les données",
            icon: "delete",
            color: "red accent-2",
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const archived = await archiveItem(this, "colis", data._id);
              if (archived) this.$refs.colisTable.refreshTable();
            },
          },
          {
            text: "Activer les données",
            icon: "check",
            color: "green",
            showInArchived: true,
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const activated = await activateItem(this, "colis", data._id);
              if (activated) this.$refs.colisTable.refreshTable();
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
