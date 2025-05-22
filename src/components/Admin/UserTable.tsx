import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { type User, type UserSelection } from "../../types";
import {
  StyledTableContainer,
  StyledTableHead,
  UserAvatar,
} from "./StyledComponents";

interface UserTableProps {
  users: User[];
  currentUser: User | null;
  allSelections: Record<number, UserSelection[]>;
  onDeleteUser: (user: User) => void;
  onEditSelections: (user: User) => void;
  getDishName: (dishId: number) => string;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUser,
  allSelections,
  onDeleteUser,
  onEditSelections,
  getDishName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to get user's selections as formatted string
  const getUserSelections = (userId: number): React.ReactNode => {
    const selections = allSelections[userId] || [];
    if (selections.length === 0)
      return (
        <Typography variant="body2" color="text.secondary">
          No selections
        </Typography>
      );

    return (
      <Box>
        {selections
          .sort((a, b) => a.rank - b.rank)
          .map((selection) => (
            <Chip
              key={selection.dishId}
              label={`${selection.rank}: ${getDishName(selection.dishId)}`}
              size="small"
              color={
                selection.rank === 1
                  ? "primary"
                  : selection.rank === 2
                  ? "secondary"
                  : "default"
              }
              sx={{ 
                m: 0.5,
                fontSize: isSmallMobile ? '0.7rem' : undefined
              }}
            />
          ))}
      </Box>
    );
  };

  // Action buttons component for reuse
  const ActionButtons = ({ user }: { user: User }) => (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
      <Tooltip title="Edit Selections">
        <IconButton
          color="primary"
          onClick={() => onEditSelections(user)}
          disabled={user.id === currentUser?.id}
          size={isSmallMobile ? "small" : "medium"}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete User">
        <IconButton
          color="error"
          onClick={() => onDeleteUser(user)}
          disabled={user.id === currentUser?.id}
          size={isSmallMobile ? "small" : "medium"}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Mobile card layout
  if (isMobile) {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {users.map((user) => (
            <Card key={user.id} sx={{ width: '100%' }}>
              <CardContent sx={{ pb: 1 }}>
                {/* User Info Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <UserAvatar>{user.name.charAt(0)}</UserAvatar>
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                  <Chip
                    icon={
                      user.isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />
                    }
                    label={user.isAdmin ? "Admin" : "User"}
                    color={user.isAdmin ? "secondary" : "default"}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Selections */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Dishes:
                  </Typography>
                  {getUserSelections(user.id)}
                </Box>
              </CardContent>
              
              <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                <ActionButtons user={user} />
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  // Desktop table layout
  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Selected Dishes</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <UserAvatar>{user.name.charAt(0)}</UserAvatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  icon={
                    user.isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />
                  }
                  label={user.isAdmin ? "Admin" : "User"}
                  color={user.isAdmin ? "secondary" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{getUserSelections(user.id)}</TableCell>
              <TableCell align="right">
                <ActionButtons user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default UserTable;