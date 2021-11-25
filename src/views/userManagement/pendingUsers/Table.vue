<template>
  <DataTable :table="table" ref="usersTable" />
</template>

<script>
import DataTable from "../../../components/helpers/DataTable";
import { updateUser } from "../../../api/userManagement/users";

export default {
  components: { DataTable },
  data() {
    return {
      table: {
        title: 'Liste des utilisateurs en attente',
        toolbar: {
          search: true,
          selectAll: true,
          exportButtons: true,
          daterange: {
            display: false,
            fieldName: 'createdAt'
          },
          filters: [
            {
              type: 'input',
              fieldName: 'firstName',
              label: 'First Name',
              value: ''
            },
            {
              type: 'input',
              fieldName: 'lastName',
              label: 'Last Name',
              value: ''
            },
            {
              type: 'input',
              fieldName: 'username',
              label: 'Username',
              value: ''
            },
            {
              type: 'input',
              fieldName: 'email',
              label: 'Email',
              value: ''
            },
            {
              type: 'select',
              options: ['Admin', 'User', 'Guest'],
              fieldName: 'role.name',
              label: 'Role',
              value: ''
            }
          ],
          topRightButtons: [
            {
              text: "Activer les utilisateurs",
              icon: "check",
              isVisible: () => this.hasAccess(['admin']),
              action: () => {
                this.activateSelected();
              }
            }
          ]
        },
        filters: {
          isPending: true
        },
        settings: {
          url: "users/table",
          isServerSide: true,
          pagination: {
            sortBy: 'createdAt',
            descending: true,
            rowsPerPage: 25
          }
        },
        headers: [
          { text: "Nom", align: "left" },
          { text: "Nom d'utilisatreur" },
          { text: "Email" },
          { text: "Rôle" },
          { text: "Crée le" }
        ],
        contents: [
          {
            data: "firstName",
            render: (data, full) => {
              return `${data} ${full.lastName || ''}`;
            }
          },
          { data: "username" },
          { 
            data: "email",
            render: data => {
              return `<button type="button" class="blue--text text-lowercase theme--dark v-btn v-btn--depressed v-btn--outline v-btn--round v-btn--small">
                    <div class="v-btn__content">${data}</div>
                  </button>`;
            },
            getRecord: data => {
              alert(`Action de colonne. Obtenir des données de ligne, envoyer un e-mail: ${data.email}`);
            }
          },
          { data: "role.name" },
          { data: "role.level", hideColumn: true },
          {
            data: "createdAt",
            render: data => {
              return this.timeZone(data, 'DD MMM YYYY H:mm z');
            }
          },
          { data: "lastName", hideColumn: true }
        ],
        actions: [
          {
            text: "Activer l'utilisateur",
            icon: "check",
            color: "green",
            isVisible: data => data.role.level > -1 && this.hasAccess(['admin']),
            getRecord: async data => {
              await this.activateUser(data._id);
            }
          }
        ]
      }
    };
  },
  methods: {
    async activateUser(id) {
      const body = {
        _id: id,
        isActive: true,
        isPending: false
      };
      const activate = await this.$root.$confirm(
        "Activer?",
        "Êtes-vous sûr de vouloir activer cet utilisateur?",
        { color: "success lighten-1" }
      );
      try {
        if (activate) {
          this.$root.$dialogLoader.show('Veuillez patienter svp...', { color: 'primary' });
          await updateUser(body);
          this.$root.$dialogLoader.hide();
          this.$refs.usersTable.refreshTable();
          this.$snotify.success("Utilisateur activé", "Success");
        }
      } catch (error) {
        this.$snotify.error("Échec de l'activation de l'utilisateur !", "Erreur");
        this.$root.$dialogLoader.hide();
      }
    },
    async activateSelected() {
      const users = JSON.parse(JSON.stringify(this.table.selected));
      if (users.length < 1) return this.$snotify.error("Veuillez sélectionner les utilisateurs", "Erreur");
      const activate = await this.$root.$confirm(
        "Activer?",
        "Êtes-vous sûr de vouloir activer les utilisateurs sélectionnés?",
        { color: "success lighten-1" }
      );
      try {
        if (activate) {
          this.$root.$dialogLoader.show('Veuillez patienter svp...', { color: 'primary' });
          const activateUsers = users.map(user => {
            return updateUser({
              _id: user._id,
              isActive: true,
              isPending: false
            });
          });
          await Promise.all(activateUsers);
          this.$root.$dialogLoader.hide();
          this.$refs.usersTable.refreshTable();
          this.$snotify.success("Utilisateurs sélectionnés activés", "Succès");
        }
      } catch (error) {
        this.$snotify.error("Échec de l'activation de l'utilisateur!", "Erreur");
        this.$root.$dialogLoader.hide();
      }
    },
  }
};
</script>