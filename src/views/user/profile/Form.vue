<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          v-model="editedItem.firstName"
          :rules="rules.firstName"
          label="Prénom"
          required
          class="required"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field v-model="editedItem.lastName" label="Nom"></v-text-field>
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="editedItem.username"
          :rules="rules.username"
          label="Nom d'utilisateur"
          required
          class="required"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="editedItem.email"
          :rules="rules.email"
          label="Email"
          type="email"
          required
          class="required"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="editedItem.password"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          label="Mot de passe"
          :readonly="!changePassword"
          :append-outer-icon="changePassword ? 'lock_open' : 'lock'"
          @click:append-outer="changePassword = !changePassword"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm4>
        <DatePicker
          label="Date de naissance"
          :date.sync="editedItem.dateOfBirth"
          :rules="rules.dateOfBirth"
        ></DatePicker>
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="editedItem.phone"
          label="Téléphone"
          required
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm4>
        <v-radio-group v-model="editedItem.gender" row class="justify-center">
          <v-radio label="Homme" value="male" color="blue"></v-radio>
          <v-radio label="Femme" value="female" color="blue"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <Address :value.sync="editedItem.address" :required="false" :rules="rules.required" />
    <v-layout align-end justify-center pt-4>
      <v-btn color="primary" round :loading="loadingBtn" :disabled="!valid" @click.native="save">Enregistrer</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
import { mapActions } from "vuex";
import { updateMyProfile, getMyProfile } from "../../../api/userManagement/users";
import { getRoleOptions } from "../../../api/userManagement/roles";
import DatePicker from "../../../components/helpers/DatePicker";
import Address from "../../../components/helpers/Address";

export default {
  props: ["mainData", "loading"],
  components: { DatePicker, Address },
  data() {
    return {
      user: this.$store.getters["user/profile"],
      roles: [],
      editedItem: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        address : {
          country : "",
          state : "",
          city : "",
          streetName : ""
        },
        image: "",
      },

      // Form Rules
      valid: false,
      loadingBtn: false,
      showPassword: false,
      changePassword: false,
      rules: {
        firstName: [v => !!v || "Le prénom est obligatoire"],
        username: [
          v => !!v || "Le nom d'utilisateur est obligatoire",
          v => v.length >= 4 || "Le nom d'utilisateur doit avoir au moins 4 lettres.",
          v => /^([a-zA-Z0-9._])+$/.test(v) || "Caractère non autorisé. Autorisé: (a-z), (A-Z), (0-9), (.), (_)"
        ],
        email: [
          v => !!v || "Email obligatoire",
          v => this.isEmailValid(v) || "Email non valide"
        ],
        password: [
          v => !!v || "Le mot de passe est obligatoire",
          v => (!!v && v.length >= 5) || "Le mot de passe doit avoir au moins 4 lettres"
        ],
        role: [v => !!v || "Le rôle est obligatoire"],
        dateOfBirth: [v => !!v || "La date de naissance est obligatoire"],
        required: [v => !!v || "Ce champ est obligatoire"],
      },
      // =================
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * Import action from Vuex Store
     */
    ...mapActions({
      setProfile: "user/setProfile"
    }),
    /**
     * Load User Profile Data
     */
    async initData() {
      try {
        this.loadingBtn = true;
        this.$emit("update:loading", true);
        await getRoleOptions().then(response => {
          this.roles = response.data.data;
        });
        const user = await getMyProfile();
        this.editedItem = user.data.data;
        this.$emit("update:mainData", {...this.editedItem});
        return user.data.success;
      } catch (error) {
        this.notifyErrors(error);
      } finally {
        this.loadingBtn = false;
        this.$emit("update:loading", false);
      }
    },

    /**
     * Save edited Data,
     * then save to Vuex Store
     */
    async save() {
      this.loadingBtn = true;
      this.$emit("update:loading", true);
      let data = JSON.parse(JSON.stringify(this.editedItem));
      try {
        if (this.$refs.form.validate()) {
          if (!data.password) delete data.password;
          const user = await updateMyProfile(data);
          this.$emit("update:mainData", {...user.data.data});
          this.setProfile(user.data.data);
          this.$snotify.success("Données enregistrées!", "Success");
          return;
        }
      } catch (error) {
        this.notifyErrors(error);
      } finally {
        this.loadingBtn = false;
        this.$emit("update:loading", false);
      }
    },

    /**
     * Validate Email
     * @param {String} email
     * @returns {Boolean}
     */
    isEmailValid(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  }
}
</script>
