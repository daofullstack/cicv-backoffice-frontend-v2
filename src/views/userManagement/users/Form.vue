<template>
  <v-container grid-list-lg v-loading="loading" pt-2 pl-0 pr-0>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="user-image-background mb-2 pt-3">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-avatar
                  class="cursor-pointer"
                  size="100"
                  color="grey lighten-3"
                  v-on="(!isReadonly || !isAdmin) && !editedItem.useImage ? on : null"
                  @click="
                    (!isReadonly || !isAdmin) && !editedItem.useImage ? getAvatar() : null
                  "
                >
                  <v-img
                    :src="profilePicture"
                    class="elevation-10"
                    v-if="editedItem.useImage"
                  />
                  <g-avatar
                    :value="editedItem.avatar"
                    className="elevation-10"
                    v-if="!editedItem.useImage"
                  />
                </v-avatar>
              </template>
              <span>Click to randomize</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4 md4>
          <v-text-field
            v-model="editedItem.firstName"
            label="Prénom"
            class="required"
            :rules="rules.firstName"
            required
            :readonly="isReadonly"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-text-field
            v-model="editedItem.lastName"
            label="Nom de famille"
            :readonly="isReadonly"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                :items="roles"
                v-model="editedItem.roleID"
                :rules="rules.roleID"
                label="Rôle"
                class="required"
                required
                :readonly="isReadonly || isAdmin"
                v-on="isReadonly || isAdmin ? on : null"
              ></v-autocomplete>
            </template>
            <span>Seul l'adlinistrateur peut modifier</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="editedItem.username"
                :rules="rules.username"
                label="Nom d'utilisateur"
                class="required"
                required
                :readonly="isReadonly || isAdmin"
                v-on="isReadonly || isAdmin ? on : null"
              ></v-text-field>
            </template>
            <span>Seul l'administrateur peut modifier</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="editedItem.email"
                :rules="rules.email"
                label="Email"
                type="email"
                class="required"
                required
                :readonly="isReadonly || isAdmin"
                v-on="isReadonly || isAdmin ? on : null"
              ></v-text-field>
            </template>
                <span>Seul l'administrateur peut modifier</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 sm4 md4 v-if="!$route.params.id">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="editedItem.password"
                :rules="rules.password"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                label="Mot de passe"
                @click:append="isReadonly ? null : (showPassword = !showPassword)"
                required
                class="required"
                :readonly="isReadonly || isAdmin"
                v-on="isReadonly || isAdmin ? on : null"
              ></v-text-field>
            </template>
               <span>Seul l'administrateur peut modifier</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 sm4 md4 v-else>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="editedItem.password"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                :readonly="!changePassword || isReadonly || isAdmin"
                :append-outer-icon="changePassword ? 'lock_open' : 'lock'"
                @click:append-outer="
                  isReadonly ? null : (changePassword = !changePassword)
                "
                @click:append="isReadonly ? null : (showPassword = !showPassword)"
                v-on="isReadonly || isAdmin ? on : null"
              ></v-text-field>
            </template>
                <span>Seul l'administrateur peut modifier</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-radio-group
            v-model="editedItem.gender"
            row
            class="justify-center"
            :readonly="isReadonly"
          >
            <v-radio label="Homme" value="male" color="blue"></v-radio>
            <v-radio label="Femme" value="female" color="blue"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <DatePicker
            label="Date de naissance"
            :date.sync="editedItem.dateOfBirth"
            :rules="rules.dateOfBirth"
            required
            className="required"
            :readonly="isReadonly"
          ></DatePicker>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-text-field
            v-model="editedItem.phone"
            label="Téléphone"
            required
            :readonly="isReadonly"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <Address :value.sync="editedItem.address" :readonly="isReadonly"></Address>
    </v-form>
    <v-layout align-end justify-center pt-4>
      <v-btn class="secondary-color" flat round :disabled="loading" to="/users/table"
        >Annuler</v-btn
      >
      <v-btn
        class="primary-color-2"
        round
        :loading="loading"
        :disabled="!valid"
        @click.native="save"
        v-if="!isReadonly"
        >Enregistrer</v-btn
      >
    </v-layout>
  </v-container>
</template>

<script>
import { newUser, updateUser, getUser } from "../../../api/userManagement/users";
import { getRandomAvatar } from "../../../components/helpers/jsUtills/getAvatar";
import { getRoleOptions } from "../../../api/userManagement/roles";
import DatePicker from "../../../components/helpers/DatePicker";
import Address from "../../../components/helpers/Address";
export default {
  components: { DatePicker, Address },
  data() {
    return {
      roles: [],
      editedItem: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        roleID: "",
        phone: "",
        gender: "male",
        address: {
          country: "",
          state: "",
          city: "",
          streetName: "",
        },
        image: "",
        avatar: "",
      },

      // Form Rules
      valid: false,
      loading: false,
      loadingBtn: false,
      showPassword: false,
      changePassword: false,
      rules: {
        firstName: [(v) => !!v || "Le prénom est requis"],
        username: [
          (v) => !!v || "Le nom d'utilisateur est obligatoire",
          (v) => v.length >= 4 || "Le nom d'utilisateur doit avoir au moins 4 lettres.",
          (v) =>
            /^([a-zA-Z0-9._])+$/.test(v) ||
            "Caractère non autorisé. Autorisé: (a-z), (A-Z), (0-9), (.), (_)",
        ],
        email: [
          (v) => !!v || "Email obligatoire",
          (v) => this.isEmailValid(v) || "Email non valide",
        ],
        password: [
          (v) => !!v || "Mot de passe obligatoire",
          (v) => (!!v && v.length >= 5) || "Le mot de passe doit avoir au moins 4 lettres",
        ],
        roleID: [(v) => !!v || "Le rôle est obligatoire"],
        dateOfBirth: [(v) => !!v || "Date de naissance"],
      },
      // =================
    };
  },
  computed: {
    /**
     * Get the image format wether avatar or png image.
     * If use image then add a param version to get the latest image state,
     * else is avatar string
     */
    profilePicture() {
      return !this.editedItem.useImage
        ? this.editedItem.avatar
        : this.editedItem.image
        ? `${this.editedItem.image}?v=${this.$moment().format("x")}`
        : "";
    },
    /**
     * Check wether user has access write or admin
     */
    isReadonly() {
      return !this.hasAccess(["write", "admin"]);
    },
    /**
     * Check wether user has access admin
     */
    isAdmin() {
      return !this.hasAccess(["admin"]);
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * Load selected user data
     */
    async initData() {
      try {
        this.loading = true;
        await getRoleOptions().then((response) => {
          this.roles = response.data.data;
        });
        if (this.$route.params.id) {
          const user = await getUser(this.$route.params.id);
          this.editedItem = { ...user.data.data };
        } else {
          this.editedItem.avatar = getRandomAvatar();
        }
      } catch (error) {
        this.notifyErrors(error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save user data
     */
    async save() {
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.editedItem));
      try {
        if (this.$refs.form.validate()) {
          if (this.$route.params.id) {
            data._id = this.$route.params.id;
            if (!data.password) delete data.password;
            await updateUser(data);
          } else {
            await newUser(data);
          }
          this.$snotify.success("Données enregistrées!", "Succès");
          return this.$router.push({ name: "usersTable" });
        }
      } catch (error) {
        this.notifyErrors(error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Randomize avatar
     */
    getAvatar() {
      this.editedItem.avatar = getRandomAvatar();
    },

    /**
     * Validate Email
     * @param {String} email
     * @returns {Boolean}
     */
    isEmailValid(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
  },
};
</script>
