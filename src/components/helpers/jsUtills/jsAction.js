import { updateRowTable, deleteRowTable } from "../../../api/utilities/datatable";

/**
 * Archive Helper
 * @param {Component} component 
 * @param {String} url 
 * @param {String} id 
 * @returns {Boolean}
 */
export async function archiveItem(component, url, id) {
  const body = {
    _id: id,
    isActive: false
  };
  const del = await component.$root.$confirm(
    "Archiver?",
    "Êtes-vous sûr de vouloir archiver ces données ?",
    { color: "error lighten-1" }
  );
  try {
    if (del) {
      component.$root.$dialogLoader.show('Veuillez patienter svp...', { color: 'primary' });
      await updateRowTable(url, body);
      component.$root.$dialogLoader.hide();
      component.$snotify.success("Suppression effectuée", "Success");
    }
    return del;
  } catch (error) {
    console.log(error)
    component.notifyErrors(error);
    component.$root.$dialogLoader.hide();
    return false;
  }
}

/**
 * Activate Helper
 * @param {Component} component 
 * @param {String} url 
 * @param {String} id 
 * @returns {Boolean}
 */
export async function activateItem(component, url, id) {
  const body = {
    _id: id,
    isActive: true
  };
  const activate = await component.$root.$confirm(
    "Activer?",
    "Êtes-vous sûr de vouloir activer ces données ?",
    { color: "success lighten-1" }
  );
  try {
    if (activate) {
      component.$root.$dialogLoader.show('Veuillez patienter svp...', { color: 'primary' });
      await updateRowTable(url, body);
      component.$root.$dialogLoader.hide();
      component.$snotify.success("Données activées", "Success");
    }
    return activate;
  } catch (error) {
    console.log(error)
    component.notifyErrors(error);
    component.$root.$dialogLoader.hide();
    return false;
  }
}

/**
 * Delete Helper
 * @param {Component} component 
 * @param {String} url 
 * @param {String} id 
 * @returns {Boolean}
 */
export async function deleteItem(component, url, id) {
  const deleteUrl = url + '/' + id;
  const del = await component.$root.$confirm(
    "Supprimer?",
    "Êtes-vous sûr de vouloir supprimer ces données ?",
    { color: "error lighten-1" }
  );
  try {
    if (del) {
      component.$root.$dialogLoader.show('Veuillez patienter...', { color: 'primary-color' });
      await deleteRowTable(deleteUrl);
      component.$root.$dialogLoader.hide();
      component.$snotify.success("Données supprimées", "Success");
    }
    return del;
  } catch (error) {
    console.log(error)
    component.notifyErrors(error);
    component.$root.$dialogLoader.hide();
    return false;
  }
}