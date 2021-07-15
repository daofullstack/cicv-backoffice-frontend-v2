<template>
  <div>
    <DataTable :table="table" ref="transactionTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateOne } from "../../../api/transactionManagement/transactions";
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
        title: "Transaction Table",
        filters: {},
        settings: {
          url: "transaction/table",
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
              text: "Add Transaction",
              icon: "add",
              isVisible: () => this.hasAccess(["write", "admin"]),
              action: () => {
                this.$router.push({ name: "transactionsAdd" });
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
              type: "input",
              fieldName: "departure_place",
              label: "departure_place",
              value: "",
            },
            {
              type: "input",
              fieldName: "arrival_place",
              label: "arrival_place",
              value: "",
            },
            {
              type: "input",
              fieldName: "departure_date",
              label: "departure_date",
              value: "",
            },
            {
              type: "input",
              fieldName: "arrival_date",
              label: "arrival_date",
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
          { text: "departure_place", align: "left" },
          { text: "arrival_place" },
          { text: "departure_date" },
          { text: "arrival_date" },
          { text: "isActive" },
          { text: "Created At" },
        ],
        contents: [
          { data: "departure_place" },
          { data: "arrival_place" },
          {
            data: "departure_date",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY");
            },
          },
          {
            data: "arrival_date",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY ");
            },
          },
          { data: "isActive" },
          {
            data: "createdAt",
            render: (data) => {
              return this.timeZone(data, "DD MMM YYYY H:mm z");
            },
          },
        ],
        actions: [
          {
            text: "View or Edit",
            icon: "mdi-lead-pencil",
            color: "teal lighten-2",
            isVisible: () => this.hasAccess(["read", "write", "admin"]),
            getRecord: (data) => {
              this.$router.push({ name: "transactionsEdit", params: { id: data._id } });
            },
          },
          {
            text: "Delete Data",
            icon: "delete",
            color: "red accent-2",
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const archived = await archiveItem(this, "transaction", data._id);
              if (archived) this.$refs.transactionTable.refreshTable();
            },
          },
          {
            text: "Activate Data",
            icon: "check",
            color: "green",
            showInArchived: true,
            isVisible: (data) => this.hasAccess(["admin"]) && !this.isSelf(data),
            getRecord: async (data) => {
              const activated = await activateItem(this, "transaction", data._id);
              if (activated) this.$refs.transactionTable.refreshTable();
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
        return this.$snotify.error("Please select datas other than yourself", "Error");
      const del = await this.$root.$confirm(
        "Archive?",
        "Are you sure you want to archive selected datas?",
        { color: "error lighten-1" }
      );
      try {
        if (del) {
          this.$root.$dialogLoader.show("Please wait...", { color: "primary" });
          const archiveUsers = filtered.map((data) => {
            return updateOne({
              _id: data._id,
              isActive: false,
            });
          });
          await Promise.all(archiveUsers);
          this.$root.$dialogLoader.hide();
          this.$refs.transactionTable.refreshTable();
          this.$snotify.success("Selected datas archived", "Success");
        }
      } catch (error) {
        this.$snotify.error("Failed to archive data!", "Error");
        this.$root.$dialogLoader.hide();
      }
    },
  },
};
</script>
