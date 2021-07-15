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
            v-model="editedItem.name"
            label=" Name"
            class="required"
            :rules="rules.name"
            required
            :readonly="isReadonly"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-text-field
            v-model="editedItem.description"
            label="description"
            :readonly="isReadonly"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm4 md4>
          <v-radio-group
            v-model="editedItem.isActive"
            row
            class="justify-center"
            :readonly="isReadonly"
          >
            <v-radio label="Activer" value="true" color="blue"></v-radio>
            <v-radio label="Desactiver" value="false" color="blue"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout align-end justify-center pt-4>
      <v-btn
        color="primary darken-1"
        flat
        round
        :disabled="loading"
        to="/boardingtype/table"
        >Cancel</v-btn
      >
      <v-btn
        color="primary"
        round
        :loading="loading"
        :disabled="!valid"
        @click.native="save"
        v-if="!isReadonly"
        >Save</v-btn
      >
    </v-layout>
  </v-container>
</template>

<script>
import { newUser, updateUser, getUser } from "../../../api/userManagement2/users";
import { getRandomAvatar } from "../../../components/helpers/jsUtills/getAvatar";
import { getRoleOptions } from "../../../api/userManagement2/roles";
export default {
  components: {},
  data() {
    return {
      roles: [],
      editedItem: {
        name: "",
        description: "",
        isActive: true,
        image: "",
        avatar: "",
      },

      // Form Rules
      valid: false,
      loading: false,
      loadingBtn: false,

      rules: {
        name: [(v) => !!v || "Name is required"],
        description: [(v) => !!v || "description is required"],
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
     * Check wether boarding_type has access write or admin
     */
    isReadonly() {
      return !this.hasAccess(["write", "admin"]);
    },
    /**
     * Check wether boarding_type has access admin
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
     * Load selected boarding_type data
     */
    async initData() {
      try {
        this.loading = true;
        await getRoleOptions().then((response) => {
          this.roles = response.data.data;
        });
        if (this.$route.params.id) {
          const boarding_type = await getUser(this.$route.params.id);
          this.editedItem = { ...boarding_type.data.data };
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
     * Save boarding_type data
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
          this.$snotify.success("Data saved!", "Success");
          return this.$router.push({ name: "usersTable2" });
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
  },
};
</script>
