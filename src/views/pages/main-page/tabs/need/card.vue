<template>
  <li v-if="!data.delete" :class="['card', {editing: data.editing, finished: data.finished}]" flex>
    <template v-if="data.editing">
      <select :data-type="data.type" @change="$emit('change-type', $event.target.value)">
        <option v-for="item in typeList" :selected="item===data.type">{{ item }}</option>
      </select>
      <textarea :value="data.content" @change="$emit('change-content', $event.target.value)" placeholder="请输入内容"></textarea>
    </template>
    <template v-else>
      <b :type="data.type">{{data.type}}</b>
      <p>{{data.content}}</p>
    </template>
    <label flex>
      <span @click="$emit('toggle-editing', !data.editing)" :class="['edit', {editing: data.editing}]" flex>
        <icon-svg :name="data.editing?'ok':'edit'"/>
      </span>
      <span v-if="!data.editing" class="finish" @click="$emit('change-finished', !data.finished)"></span>
      <span @click="$emit('delete')" class="delete" v-else flex>
        <icon-svg name="delete"/>
      </span>
    </label>
  </li>
</template>

<script>
import SingleButton from "@/views/components/single-button";
import IconSvg from "@/icons/IconSvg";
export default {
  name: "card",
  components: {IconSvg, SingleButton},
  props: {
    data: {
      type: Object
    }
  },
  emits: ['change-type', 'change-content', 'toggle-editing', 'change-finished', 'delete'],
  data (){
    return {
      typeList: ['普通', '置顶', '重要', '不重要'],
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.card{
  margin-top: .8rem;
  padding: 1.2rem .5rem;
  border-radius: .3rem;
  background: #efefef;
  border: 1px solid #e0e0e0;
  &:hover{
    border-color: #adadad;
    >label >.edit{
      display: flex !important;
    }
  }
  &.editing{
    >label >.edit{
      display: flex !important;
    }
    >select{
      width: 5.5rem;
      font-size: .7rem;
      margin-right: .5rem;
    }
    >textarea{
      font-size: .9rem;
      flex-grow: 1;
      margin-right: .5rem;
      resize: vertical;
    }
  }
  &:not(.editing){
    >b{
      font-size: .7rem;
      padding: .25rem 0;
      border-radius: .3rem;
      width: 3.6rem;
      text-align: center;
      font-weight: normal;
      &[type=普通] {
        background: white;
        border: 1px solid #cecece;
        color: black;
      }
      &[type=置顶]{
        background: #ff3b3b;
        color: white;
      }
      &[type=重要]{
        background: #9a20ff;
        color: white;
      }
      &[type=不重要]{
        background: #5eb700;
        color: white;
      }
    }
    >p{
      margin: 0 .5rem;
      font-size: .9rem;
      word-break: break-word;
      flex-shrink: 1;
    }
  }
  >label{
    margin-left: auto;
    >.edit, >.delete{
      fill: red;
      &.edit {
        display: none;
        margin-right: .8rem;
        fill: #ff5300;
        &.editing{
          fill: #007dff;
        }
      }
      cursor: pointer;
      >svg{
        width: 1.2rem;
        height: 1.2rem;
      }
    }
    >.finish{
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 20%;
      border: 1px solid #a5a5a5;
      cursor: pointer;
      background: white;
      box-shadow: 0 0 .1rem rgba(0, 0, 0, .3);
      &:hover{
        border-color: #395bff;
      }
    }
  }
  &.finished>label{
    >.finish {
      background: #637dff;
      border-color: #3e23ff;
    }
  }
}
</style>