<template>
  <li :class="['card', {editing, finished: data.finished}]" flex>
    <template v-if="editing">
      <select @change="$emit('change-type', $event.target.value)">
        <option v-for="item in typeList" :selected="item===data.type">{{ item }}</option>
      </select>
      <input :value="data.content" @change="$emit('change-content', $event.target.value)" placeholder="请输入内容"/>
      <single-button type="danger" @click="$emit('delete')">删除</single-button>
    </template>
    <template v-else>
      <b>{{data.type}}</b>
      <p>{{data.content}}</p>
    </template>
    <label @click="$emit('change-finished', !data.finished)"></label>
  </li>
</template>

<script>
import SingleButton from "@/views/components/single-button";
export default {
  name: "card",
  components: {SingleButton},
  props: {
    data: {
      type: Object
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change-type', 'change-content', 'change-finished', 'delete'],
  data (){
    return {
      typeList: ['普通', '置顶', '重要', '不重要']
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.card{
  &.editing{

  }
  &:not(.editing){
    >b{

    }
    >p{

    }
  }
  >label{
    width: 1rem;
    height: 1rem;
    border: 1px solid gray;
    cursor: pointer;
  }
  &.finished>label{
    background: #395bff;
  }
}
</style>