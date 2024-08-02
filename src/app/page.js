'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  Modal, 
  TextField, 
  Container, 
  Paper 
} from '@mui/material'
import { firestore } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() })
      })
      setInventory(inventoryList)
    } catch (error) {
      console.error("Error fetching inventory: ", error)
    }
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error("Error adding item: ", error)
    }
  }
  
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    } catch (error) {
      console.error("Error removing item: ", error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Inventory Management
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField 
              fullWidth 
              label="Search Items" 
              variant="outlined" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="contained" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={3}>
          <Box p={3} bgcolor="primary.dark" textAlign={'center'}>
            <Typography variant="h4" color="primary.contrastText">
              Inventory Items
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
            {filteredInventory.map(({name, quantity}) => (
              <Paper key={name} elevation={2}>
                <Box
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="subtitle1">
                    Quantity: {quantity}
                  </Typography>
                  <Button variant="outlined" color="secondary" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleOpen} size="large">
            Add New Item
          </Button>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="add-item-modal" variant="h6" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName.trim())
                  setItemName('')
                  handleClose()
                }
              }}
              color="primary"
              variant="contained"
              sx={{ ml: 2 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}