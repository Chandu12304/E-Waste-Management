import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "./ItemSection.css";

const ItemsSection = () => {
  const [items, setItems] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemCondition, setNewItemCondition] = useState("");
  const [newItemCentre, setNewItemCentre] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch collection centres
  useEffect(() => {
    axios
      .get("http://localhost:3000/collectionCentre")
      .then((response) => {
        let centresData = response.data;
        if (!Array.isArray(centresData)) {
          console.error("Expected an array but got:", centresData);
          centresData = [];
        }
        // Limit to only the first three centres.
        let limitedCentres = centresData.slice(0, 3);
        // Check if a centre was selected in CentresList.
        if (location.state && location.state.selectedCentre) {
          const selectedCentre = location.state.selectedCentre; // Object with center_id, center_name, city, etc.
          const found = limitedCentres.find(
            (centre) => centre.center_id === selectedCentre.center_id
          );
          if (!found) {
            // Find the selected centre in the full list.
            const selectedCentreData = centresData.find(
              (centre) => centre.center_id === selectedCentre.center_id
            );
            if (selectedCentreData) {
              // Replace the first centre with the selected centre data.
              limitedCentres[0] = selectedCentreData;
            }
          }
          // Store the centre id as the selected value.
          setNewItemCentre(String(selectedCentre.center_id));
        } else if (limitedCentres.length > 0) {
          setNewItemCentre(String(limitedCentres[0].center_id));
        }
        setCentres(limitedCentres);
        setLoadingCentres(false);
      })
      .catch((error) => {
        console.error("Error fetching centres:", error);
        setLoadingCentres(false);
      });
  }, [location.state]);

  // Fetch e-waste items for the logged in user.
  useEffect(() => {
    const email = localStorage.getItem("email");
    axios
      .get("http://localhost:3000/ewaste-items")
      .then((response) => {
        const allItems = response.data;
        // Filter items whose nested users.email matches the email in localStorage.
        const filteredItems = allItems.filter(
          (item) => item.users && item.users.email === email
        );
        setItems(filteredItems);
        setLoadingItems(false);
      })
      .catch((error) => {
        console.error("Error fetching e-waste items:", error);
        setLoadingItems(false);
      });
  }, []);

  const handleCentreChange = (e) => {
    const value = e.target.value;
    if (value === "find_more") {
      // Navigate to the centres list page when "Find More" is selected.
      navigate("/centresList");
    } else {
      setNewItemCentre(value);
    }
  };

  const addItem = async () => {
    if (newItemName && newItemCategory && newItemCondition && newItemCentre) {
      try {
        // Retrieve the email from localStorage (set during login)
        const email = localStorage.getItem("email");
        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }
  
        // Fetch user data using the stored email
        const userResponse = await axios.get("http://localhost:3000/users", {
          params: { email }
        });
        
        // Extract user_id from the user data
        const userData = userResponse.data;
        const user_id = userData.user_id;
        if (!user_id) {
          console.error("User ID not found in the response");
          return;
        }
  
        // Create the payload with the retrieved user_id along with other fields
        const payload = {
          item_name: newItemName,
          category: newItemCategory,
          item_condition: newItemCondition,
          user_id, // from fetched userData
          center_id: parseInt(newItemCentre, 10)
        };
  
        // Post the payload to your insert endpoint
        const insertResponse = await axios.post(
          "http://localhost:3000/ewaste-items/insert",
          payload
        );
  
        // Assuming the response returns the inserted item(s) in an array
        const insertedItems = insertResponse.data;
        setItems([...items, ...insertedItems]);
  
        // Clear input fields
        setNewItemName("");
        setNewItemCategory("");
        setNewItemCondition("");
        if (centres.length > 0) {
          setNewItemCentre(String(centres[0].center_id));
        }
        window.location.reload();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  // Delete item function
  const deleteItem = async (item) => {
    try {
      // Retrieve user email from localStorage
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }

      // Fetch user data using the stored email
      const userResponse = await axios.get("http://localhost:3000/users", {
        params: { email }
      });
      
      // Extract user_id from the user data
      const userData = userResponse.data;
      const user_id = userData.user_id;
      if (!user_id) {
        console.error("User ID not found in the response");
        return;
      }

      // Determine center id: use item.center_id if available,
      // otherwise attempt to extract it from nested centre data.
      let center_id = item.center_id;
      if (!center_id && item.centre && item.centre.center_id) {
        center_id = item.centre.center_id;
      } else if (!center_id && item.collection_centers && item.collection_centers.center_id) {
        center_id = item.collection_centers.center_id;
      }
      
      // Build payload for deletion
      const payload = {
        item_name: item.item_name || item.name,
        category: item.category,
        item_condition: item.item_condition || item.condition,
        user_id,
        center_id: parseInt(center_id, 10)
      };

      // Send the delete request to your backend
      const deleteResponse = await axios.post(
        "http://localhost:3000/ewaste-items/delete",
        payload
      );
      
      console.log("Deleted item:", deleteResponse.data);
      
      // Remove deleted item from local state
      setItems((prevItems) =>
        prevItems.filter((i) => i.item_id !== item.item_id && i.id !== item.id)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="items_section_2090">
      <h3 className="items_heading_2090">Manage Items</h3>
      <div className="add_item_form_2090">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item Name"
        />
        <input
          type="text"
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          placeholder="Item Category"
        />
        {/* Dropdown for item condition */}
        <select
          value={newItemCondition}
          onChange={(e) => setNewItemCondition(e.target.value)}
          className="add_item_form_2090"
        >
          <option value="" disabled>
            Select Condition &#9662;
          </option>
          <option value="working" className="working_option_2110">
            Working
          </option>
          <option value="damaged" className="damaged_option_2110">
            Damaged
          </option>
        </select>
        {/* Dropdown for centre selection */}
        <select
          value={newItemCentre}
          onChange={handleCentreChange}
          className="add_item_form_2090"
        >
          {loadingCentres ? (
            <option>Loading centres...</option>
          ) : (
            <>
              <option value="" disabled>
                Select Centre &#9662;
              </option>
              {centres.map((centre) => (
                <option key={centre.center_id} value={String(centre.center_id)}>
                  {centre.center_id} - {centre.center_name} - {centre.city}
                </option>
              ))}
              <option value="find_more" className="find_more_option_2110">
                Find More....
              </option>
            </>
          )}
        </select>
        <button onClick={addItem} className="add_item_button_2090">
          Add Item
        </button>
      </div>
      <div className="items_list_2090">
        {loadingItems ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" />
            <p>Loading items...</p>
          </div>
        ) : (
          items.map((item) => {
            // Retrieve centre info from either the local item property or a joined property.
            const centreObj = item.centre || item.collection_centers;
            return (
              <div key={item.item_id || item.id} className="item_box_2090">
                <img src="/assets/gadgets.jpg" alt="Gadget" className="item_image_2090" />
                <div className="item_content_2090">
                  <p>
                    <strong>Name:</strong> {item.item_name || item.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Condition:</strong> {item.item_condition || item.condition}
                  </p>
                  <p>
                    <strong>Centre:</strong>{" "}
                    {centreObj
                      ? `${centreObj.center_id} - ${centreObj.center_name} - ${centreObj.city}`
                      : "No centre"}
                  </p>
                  <button onClick={() => deleteItem(item)} className="delete_item_button_2090">
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemsSection;
