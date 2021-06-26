<template>
  <div>
    <chat v-if="!isOpen" :users="users" :user.sync="selectedUser" />
    <chat-form v-else :user.sync="selectedUser" />
  </div>
</template>

<script>
import { getRandomAvatar } from "../helpers/jsUtills/getAvatar";
import Chat from './Chat'
import ChatForm from './ChatForm'
export default {
  props: ["drawer"],
  components: { Chat, ChatForm },
  data() {
    return {
      users: [
        { active: true, name: 'Jason Oner', avatar: getRandomAvatar(), chatData: [] },
        { active: true, name: 'Ranee Carlson', avatar: getRandomAvatar(), chatData: [] },
        { name: 'Cindy Baker', avatar: getRandomAvatar(), chatData: [] },
        { name: 'Ali Connors', avatar: getRandomAvatar(), chatData: [] }
      ],
      selectedUser: {},
      isOpen: false
    }
  },
  methods: {
    /**
     * Toggle chat right sidebar
     */
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    closeDrawer() {
      this.$emit("update:drawer", false);
    }
  }
}
</script>