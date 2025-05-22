import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { DishContext } from "../../context/DishContext";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../service/authService";
import { type User, type UserSelection } from "../../types";

// Import components
import UserTable from "../Admin/UserTable";
import DeleteDialog from "../Admin/DeleteDialog";
import EditDialog from "../Admin/EditDialog";
import Loader from "../../UI/Loader";

const AdminPanel: React.FC = () => {
  const { dishes, getAllUserSelections, updateUserSelections } =
    useContext(DishContext);
  const { currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allSelections, setAllSelections] = useState<
    Record<number, UserSelection[]>
  >({});

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSelections, setEditingSelections] = useState<UserSelection[]>(
    []
  );

  // Load users and selections
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await getAllUsers();
        setUsers(userData);

        // Get all user selections from context
        const selections = getAllUserSelections();
        setAllSelections(selections);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getAllUserSelections]);

  // Handle user deletion
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      // Remove user from local state
      setUsers(users.filter((u) => u.id !== selectedUser.id));

      // Remove user selections
      const newSelections = { ...allSelections };
      delete newSelections[selectedUser.id];
      setAllSelections(newSelections);

      // Clear user selections in localStorage
      localStorage.removeItem(`userSelections-${selectedUser.id}`);

      setOpenDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  // Handle editing user selections
  const handleEditSelections = (user: User) => {
    setSelectedUser(user);
    setEditingSelections(allSelections[user.id] || []);
    setOpenEditDialog(true);
  };

  const handleSelectionChange = (dishId: number, rank: number) => {
    // Check if dish is already in another rank
    const existingAtRank = editingSelections.find((s) => s.rank === rank);

    // Remove any previous selection of this dish
    let updatedSelections = editingSelections.filter(
      (s) => s.dishId !== dishId
    );

    // If there was a dish in this rank already, remove its rank
    if (existingAtRank && existingAtRank.dishId !== dishId) {
      updatedSelections = updatedSelections.filter((s) => s.rank !== rank);
    }

    // Add the new selection
    updatedSelections.push({ dishId, rank });
    setEditingSelections(updatedSelections);
  };

  const saveUserSelections = () => {
    if (selectedUser) {
      // Update in context and localStorage
      updateUserSelections(selectedUser.id, editingSelections);

      // Update local state
      setAllSelections({
        ...allSelections,
        [selectedUser.id]: editingSelections,
      });

      setOpenEditDialog(false);
      setSelectedUser(null);
    }
  };

  // Helper function to get dish name by id
  const getDishName = (dishId: number): string => {
    const dish = dishes.find((d) => d.id === dishId);
    return dish ? dish.dishName : "Unknown Dish";
  };

  if (loading) {
    return <Loader/>
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <AdminPanelSettingsIcon
          sx={{ fontSize: 32, mr: 2, color: "primary.main" }}
        />
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary.main"
        >
          Admin Panel
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        As an admin, you can manage users and their dish selections. You can
        edit or delete user profiles and their votes.
      </Alert>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        User Management
      </Typography>

      <UserTable
        users={users}
        currentUser={currentUser}
        allSelections={allSelections}
        onDeleteUser={handleDeleteUser}
        onEditSelections={handleEditSelections}
        getDishName={getDishName}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDeleteDialog}
        user={selectedUser}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDeleteUser}
      />

      {/* Edit User Selections Dialog */}
      <EditDialog
        open={openEditDialog}
        user={selectedUser}
        dishes={dishes}
        selections={editingSelections}
        onClose={() => setOpenEditDialog(false)}
        onSave={saveUserSelections}
        onSelectionChange={handleSelectionChange}
      />
    </Box>
  );
};

export default AdminPanel;
