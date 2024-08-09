const COLLECTION_NAME = "Inventario";
const IMAGE_FOLDER_NAME = "images";

const firestore = firebase.firestore();

document.getElementById("main-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));

  saveImage(data.imagenProducto).then((imageURL) => {
    const newData = {
      ...data,
      imagenProducto: imageURL,
    };

    saveRegister(newData);

    displayRegister(newData);
  });

  clearInputs();
});

const clearInputs = () => {
  document.getElementById("nombreProducto").value = "";
  document.getElementById("cantidadProducto").value = "";
  document.getElementById("precioProducto").value = "";
  document.getElementById("imagenProducto").value = "";
};

const getData = async () => {
  const collection = firestore.collection(COLLECTION_NAME);

  let data = [];

  await collection.get().then((res) => {
    res.forEach((item) => {
      data = [...data, item.data()];
    });
  });

  return data;
};

const displayRegister = (data) => {
  const displayNode = document.getElementById("list-products");
  const elementLi = document.createElement("li");
  const barCodeId = `barcode-${Date.now()}`;

  elementLi.innerHTML = `
  ${data.nombreProducto} - Cantidad: ${data.cantidadProducto} - Precio ${data.precioProducto}
  <br>
  <img id="${barCodeId}" alt="Código de barras">
  <img src="${data.imagenProducto}" alt="Imagen del producto">`;

  displayNode.appendChild(elementLi);
  generateBarCode(barCodeId);
};

const generateBarCode = (id) => {
  JsBarcode(`#${id}`, id, {
    format: "CODE128",
    displayValue: true,
  });
};

const saveImage = (image) =>
  new Promise((resolve, reject) => {
    const storage = firebase.storage().ref();

    const imageName = `${Date.now()}-${image.name}`;

    const imageRef = storage.child(`${IMAGE_FOLDER_NAME}/${imageName}`);

    imageRef
      .put(image)
      .then((res) => {
        res.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

const saveRegister = (data) => {
  firestore
    .collection(COLLECTION_NAME)
    .add(data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.err(err);
    });
};

getData().then((res) => {
  res.forEach((item) => {
    displayRegister(item);
  });
});
