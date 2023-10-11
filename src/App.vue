<template>
  <div class='app'>
    <span v-if='errorFetchData'>
          class="span-error-message">
      Ошибка при получении данных: <br> {{ errorMessage }}</span>
    <div class='modal'
         v-if='isShowModal'
         @click.stop='hideModal'>
      <div @click.stop
           class='modal__inner'>
        <label for='selection'>
          <select id='selection'
                  @click.stop
                  @change='onchangeChoise'
                  v-model='choiseAnimal'>
            <template v-for='animal in animals'
                      :key='animal.id'>
              <option v-if='animal.cell === null'
                      :value='animal.id'>{{ animal.name }}</option>
            </template>
          </select>
        </label>
      </div>
    </div>
    <div class='column'>
      <div class='cellList'>
        <p v-if='isLoadingCells'>идет загрузка...</p>
        <div class='cell'
             v-for='cell in cells'
             @click='showModal(cell.id)'
             @drop='animalOnEnd($event, currentAnimalId)'
             @dragover.prevent
             @dragenter='OnDragenter($event, cell.id)'
             @dragleave='onDragleave($event)'
             :key='cell.id'>
          <div @click.stop
               v-for='animal in animals'
               :key='animal.id'>
            <animal-item v-bind:animal='animal'
                         v-if='animal.cell === cell.id'
                         @dragstart='dragstart($event, animal.id)' />
          </div>
          <span @click.stop='removeCell(cell.id)'
                class='deletecell'>x</span>
        </div>

        <div class='newCellBtn'
             @click='addNewCell'>+</div>
      </div>
    </div>
    <div class='column'>
      <span></span>
      <div class='cell'>
        <p v-if='isLoadingAnimals'>идет загрузка...</p>
        <div v-for='animal in animals'
             :key='animal.id'>
          <animal-item v-bind:animal='animal'
                       v-if='animal.cell === null'
                       @dragstart='dragstart($event, animal.id)' />
        </div>
      </div>
      <form>
        <label :for='animal.id'>
          <input class='input__newAnimal'
                 :id='snimsl.id'
                 type='text'
                 v-model.trim='name' />
        </label>
        <button :disabled='btnDisabled'
                @click.prevent='addNewAnimal'
                class='btn'>Добавить</button>
        <div v-if='errorName'><span>Пустое поле</span></div>
      </form>
    </div>
  </div>
</template>

<script>
import {
  fetchCells,
  fetchAnimals,
  fetchForwardAnimal,
  fetchNewCell,
  fetchNewAnimal,
  fetchDeleteCell,
} from './api/client';

export default {

  data() {
    return {
      cells: [],
      animals: [],
      name: '',
      errorName: false,
      targetCellId: '',
      sourceCellId: '',
      currentAnimalId: '',
      isShowModal: false,
      choiseAnimal: '',
      btnDisabled: false,
      isLoadingAnimals: false,
      isLoadingCells: false,
      errorFetchData: false,
      errorMessage: '',
    };
  },

  methods: {

    onDragleave(e) {
      e.target.style.boxShadow = '';
    },

    dragstart(e, id) {
      this.currentAnimalId = id;
    },

    hideModal() {
      this.isShowModal = false;
    },

    async onchangeChoise() {
      try {
        const data = await fetchForwardAnimal(this.choiseAnimal, this.targetCellId);
        this.changeCellId(data.data?.animal);
        this.targetCellId = '';
        this.isShowModal = false;
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isShowModal = false;
      }
    },

    async addNewCell() {
      try {
        const cell = await fetchNewCell();
        this.cells.push(cell.data?.cell);
      } catch (error) {
        console.error(error.message);
      }
    },

    OnDragenter(e, id) {
      e.target.style.boxShadow = '0px 0px 10px black';
      this.targetCellId = id;
    },

    changeCellId(animal) {
      const changedAnimal = animal;
      this.animal = this.animals.map((a) => {
        if (a.id === changedAnimal.id) {
          a.cell = changedAnimal.cell;
        }
        return a;
      });
    },

    async animalOnEnd(e, animalId) {
      try {
        const data = await fetchForwardAnimal(animalId, this.targetCellId);
        this.changeCellId(data.data?.animal);
        this.currentAnimalId = '';
      } catch (error) {
        console.error(error.message);
      }
    },

    addNewAnimal() {
      if (this.name.length === 0) {
        this.errorName = true;
        return;
      }
      this.btnDisabled = true;
      fetchNewAnimal(this.name)
        .then((data) => {
          this.animals.push(data.data?.animal);
          this.errorName = false;
          this.name = '';
        })
        .catch((err) => {
          console.error(err.message);
        }).finally(() => {
          this.btnDisabled = false;
        });
    },

    async removeCell(cellId) {
      try {
        const data = await fetchDeleteCell(cellId);
        const { cId, animals } = data;
        this.cells = this.cells.filter((c) => c.id !== cId);
        animals.forEach((a) => {
          this.animals = this.animals.map((animal) => {
            if (a.id === animal.id) {
              animal = a;
            }
            return animal;
          });
        });
      } catch (error) {
        console.error(error.message);
      }
    },

    showModal(cellId) {
      this.isShowModal = true;
      this.targetCellId = cellId;
    },
  },

  mounted() {
    // Загрузка данных
    this.isLoadingAnimals = true;
    this.isLoadingCells = true;
    // get request для получения массива ячеек
    fetchAnimals()
      .then((animals) => {
        this.animals = animals;
      })
      .catch((e) => {
        this.errorFetchData = true;
        this.errorMessage = e.message;
        console.error(e);
      })
      .finally(() => {
        this.isLoadingCells = false;
      });

    // get request для получения массива животных
    fetchCells()
      .then((cells) => {
        this.cells = cells;
      })
      .catch((e) => {
        this.errorFetchData = true;
        this.errorMessage = e.message;
        console.error(e);
      })
      .finally(() => {
        this.isLoadingAnimals = false;
      });
  },

};
</script>

<style>
.app {
  min-width: 100vh;
  padding: 20px;
  display: grid;
  grid-template-columns: 3fr 1fr;
}

.column {
  box-shadow: 0 0 5px rgb(96, 96, 96);
  width: auto;
  min-height: 500px;
  border-radius: 10px;
  margin: 10px;
}

.cellList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px;
}

.cell {
  width: 250px;
  min-height: 100px;
  padding: 15px;
  padding-bottom: 50px;
  cursor: pointer;
  border: 10px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgb(57, 57, 57);
  position: relative;
}

.deletecell {
  display: block;
  position: absolute;
  padding: 10px;
  border: 1px dotted rgba(0, 0, 0, 0.258);
  right: 15px;
  bottom: 15px;
}

.newCellBtn {
  width: 45px;
  height: 45px;
  border: 1px dotted rgb(85, 85, 85);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.newCellBtn:hover {
  background-color: rgba(0, 0, 0, 0.147);
}

.modal {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.16);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__inner {
  padding: 20px;
  box-shadow: 0px 0px 5px rgb(126, 126, 126);
  background-color: white;
  border-radius: 10px;
  z-index: 9;
}

form {
  margin-top: 35px;
  padding: 10px;
}

.btn {
  background-color: black;
  padding: 10px 15px;
  border: none;
  color: white;
}

.input__newAnimal {
  padding: 10px 15px;
  border: none;
  border-bottom: 1px solid rgb(109, 109, 109);
}

.span-error-message {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 15px;
  color: white;
  background-color: red;
}
</style>
