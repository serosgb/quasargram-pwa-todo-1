<template>
  <q-page>
    <q-input
      v-model="newTask"
      placeholder="Add task"
      @keyup.enter="addTask"
      class="bg-cyan-8"
      dark
      filled
      square
    >
      <template v-slot:append>
        <q-btn
          @click="addTask"
          icon="add"
          round
          dense
          flat
        />
      </template>
    </q-input>

    <q-list
      bordered
      separator
    >
      <q-item
        v-for="task in tasks"
        :key="task.id"
        class="bg-cyan-1"
      >
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>

      </q-item>

    </q-list>    
  </q-page>
</template>

<script>
export default {
  name: 'PageTodo',
  data() {
    return {
      newTask: '',
      tasks: [],
      loadingTodos: false,
      API: 'http://localhost:3080/api'
    }
  },
  methods: {
    getTasks() {
      this.loadingTodos = true;
      this.$q.loading.show()
      console.log('Loading todos...')
      this.$axios.get(`${this.API}/todos`).then(response => {
        this.tasks = response.data;
        this.loadingTodos = false;
        this.$q.loading.hide()
      }).catch(error => {
        console.log(error);
        this.loadingTodos = false;
        this.$q.loading.hide()
      })
    },
    addTask() {
      this.$q.loading.show()
      let newTask = {
        id: Date.now(),
        title: this.newTask
      }
      this.tasks.push(newTask)

      this.$axios.post(`${this.API}/todos?id=${ newTask.id }&title=${ newTask.title }`)
        .then(response => {
          console.log('response', response);
          this.$q.loading.hide()
        }).catch( error => {
          console.log('error', error);
          this.$q.loading.hide()
        })

      this.newTask = ''
    }
  },
  created() {
    this.getTasks()
  }  
}
</script>
