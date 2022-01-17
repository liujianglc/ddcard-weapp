<template>
  <view>
    <view
      v-for="lesson in lessons"
      :key="lesson.id"
    >
      <view>{{ lesson.name }} {{ lesson.title }}</view>
      <view>
        全选以下新字
        <view
          v-for="word in lesson.common_words"
          :key="word.id"
        >
          <Word
            :word="word.word"
            :xiezi="word.xiezi == 1"
          />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import Word from '../words/index.vue'
export default {
  components: {
    Word
  },
  props: {
    lessons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: []
    }
  },
  methods: {

  }
}
</script>
