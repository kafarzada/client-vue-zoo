<template>
    <div class="animal" :draggable="true" @dragend="dragEnd(animal.id)" @dragenter.stop>
        {{ animal.name }}
    </div>
</template>

<script>
export default {
  name: 'animal-item',
  props: {
    animal: {
      type: Object,
      required: true,
    },
  },

  methods: {
    dragEnd(id) {
      this.$emit('dragstart', id);
    },
  },
};
</script>

<style scoped>
.animal {
    background-color: black;
    color: white;
    margin-top: 10px;
    padding: 10px 15px;
    border-radius: 10px;
}

.animal:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px rgb(120, 120, 120);
}
</style>
