import DesktopLayout from "@/layouts/DesktopLayout";
import {
  IAseguradora,
  IAsistencia,
  ICotizacionTecnico,
  IServicio,
  ITicket,
} from "@/services/api.models";
import { AseguradoraService } from "@/services/aseguradoras.service";
import { AsistenciasService } from "@/services/asistencias.service";
import { ServiciosService } from "@/services/servicios.service";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  ModalFooter,
  useDisclosure,
  useToast,
  Box,
  color,
  Center,
  Stack,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { FaFileSignature } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";
import { TicketsService } from "@/services/tickets.service";
import { VerTicketVialForaneo } from "@/views/VerTicketVialForaneo";
import { VerTicketVial } from "@/views/VerTicketVial";
import { VerTicketDomestico } from "@/views/VerTicketDomestico";
import { VerTicketDomesticoForaneo } from "@/views/VerTicketDomesticoForaneo";
import TicketImprimible from "components/imprimibles/ticket.imprimible";
import Printer from "components/printer/printer";
import { CrearCotizacionTecnicoManual } from "@/forms/CotizacionTecnicoManualForm ";
import { CotizacionTecnicoService } from "@/services/cotizacion-tecnico.service";

function TicketVer() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen: abierto, onOpen: abrir, onClose: cerrar } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCot,
    onOpen: onOpenCotizacionT,
    onClose: onCloseCotizacionT,
  } = useDisclosure();
  const [ticket, setTicket] = useState<ITicket>();
  const [aseguradora, setAseguradora] = useState<IAseguradora>();
  const [asistencia, setAsistencia] = useState<IAsistencia>();
  const [cotizacion, setCotizacion] = useState<ICotizacionTecnico>();

  const [serviciosList, setServiciosList] = useState<IServicio[]>([]);
  const [tecnicosByServicios, setTecnicosByServicios] = useState<IServicio>();

  const [tipoVista, setTipoVista] = useState<JSX.Element>();

  const { idTicket } = router.query;

  /*Obtener aseguradora*/
  const getAseguradora = async () => {
    const service = new AseguradoraService();
    const respuesta = await service.getById(Number(ticket?.aseguradoraId));

    const data = respuesta.data as IAseguradora;
    setAseguradora(data);
  };

  /*Obtener asistencias*/
  const getAsistencia = async () => {
    const service = new AsistenciasService();
    const respuesta = await service.getById(Number(ticket?.asistenciaId));
    const data = respuesta.data as IAsistencia;
    setAsistencia(data);
  };

  const getTicket = async () => {
    const service = new TicketsService();
    const respuesta = await service.getById(Number(idTicket));
    const data = respuesta.data as ITicket;
    console.log(data);

    setTicket(data);
  };

  const consultarServicios = async () => {
    const service = new ServiciosService();
    const respuesta = await service.getAll();
    const data = respuesta.data as IServicio[];

    setServiciosList(data);
  };

  const consultarTecnicosByServicio = async (id: number) => {
    const servicio = new ServiciosService();
    const respuesta = await servicio.getTecnicosByServicio(id);
    const data = respuesta.data as IServicio;

    setTecnicosByServicios(data);
  };

  const getAsignarTicketATecnico = async () => {
    const data = { estado: "TOMADO" };
    const service = new TicketsService();
    //TODO: Agregar el ID del ticket
    const respuesta = await service.update(data, ticket?.id || 0);

    toast({
      title: "T??cnico Asignado.",
      description: "Se Asigno el servicio al T??cnico",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const getCotizacionTecnico = async () => {
    const service = new CotizacionTecnicoService();
    const respuesta = await service.cotizacionByTicket(ticket?.id!);

    const data = respuesta.data as ICotizacionTecnico;

    setCotizacion(data);
  };
  /*Obtener ticket*/

  useEffect(() => {
    getTicket();
  }, []);

  useEffect(() => {
    getAsistencia();
    getAseguradora();
    getVista();
    consultarServicios();
  }, [ticket]);

  const getVista = () => {
    if (ticket?.asistencia_vial && ticket?.is_servicio_foraneo) {
      setTipoVista(<VerTicketVialForaneo ticket={ticket} />);
      console.log("Es vial con foraneo");
    } else if (ticket?.is_servicio_domestico && ticket?.is_servicio_foraneo) {
      setTipoVista(<VerTicketDomesticoForaneo ticket={ticket} />);
      console.log("Es domestico Foraneo");
    } else if (ticket?.asistencia_vial) {
      setTipoVista(<VerTicketVial ticket={ticket} />);
    } else if (ticket?.is_servicio_domestico) {
      setTipoVista(<VerTicketDomestico ticket={ticket} />);
      console.log("Es solo domestico");
    } else {
      setTipoVista(<></>);
    }
  };

  const dataTicket = {
    titulo: "Mecanico para JOE",
  };

  return (
    <DesktopLayout>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        position="fixed"
        width={"80px"}
        height={"80px"}
        bottom="20px"
        right={["16px", "84px"]}
        zIndex={1}
        borderWidth={1}
        bgColor={"black"}
        color={"white"}
        borderRadius={100}
        _hover={{
          boxShadow: "10px 10px 5px #DDD9D9",
          bgColor: " #98A7C9",
          color: "black",
        }}
        onClick={abrir}
      >
        <Center marginTop={"3.5"}>
          <IoAdd size={40} />
        </Center>
      </Box>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        position="fixed"
        width={"80px"}
        height={"80px"}
        bottom="120px"
        right={["16px", "84px"]}
        zIndex={1}
        borderWidth={1}
        bgColor={" #0C6A7D"}
        color={"white"}
        borderRadius={100}
        _hover={{
          boxShadow: "10px 10px 5px #DDD9D9",
          bgColor: " #618CF0",
          color: "white",
        }}
        onClick={onOpenCotizacionT}
      >
        <Center marginTop={"3.5"}>
          <FaFileSignature size={40} />
        </Center>
      </Box>

      <Box
        margin={"1%"}
        justifyContent={"center"}
        alignItems={"center"}
        position="fixed"
        width={"80px"}
        height={"80px"}
        right={["16px", "84px"]}
        zIndex={1}
      >
        <Button
          padding={"2%"}
          justifySelf="end"
          width={"150px"}
          height={"60px"}
          leftIcon={<BsPrinter size={"30px"} />}
          id="imprimirTicket"
          colorScheme="telegram"
          borderColor="twitter.100"
          size="lg"
          onClick={onOpen}
        />
      </Box>

      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Impresi??n</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Printer doc={<TicketImprimible ticket={ticket} />} />
          </ModalBody>
          <ModalFooter>
            <Stack
              align="center"
              paddingLeft={"60%"}
              spacing={4}
              direction="row"
            >
              <Button
                paddingLeft={10}
                paddingRight={10}
                colorScheme="red"
                variant="outline"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal onClose={onCloseCotizacionT} size={"full"} isOpen={isOpenCot}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Cotizacion de Tecnico</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CrearCotizacionTecnicoManual ticket={ticket!} cotizacion={cotizacion!} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseCotizacionT}>Cancelar</Button>
            <Button variant="green">Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {tipoVista}
      {/* ASIGNAR T??CNICO */}
      <Modal closeOnOverlayClick={false} isOpen={abierto} onClose={cerrar}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Asignar T??cnico</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl paddingTop={15}>
              <FormLabel htmlFor="servicioId">Servicio</FormLabel>
              <Select
                id="servicioId"
                placeholder="Selecciona el Servicio"
                variant="filled"
                borderColor="twitter.100"
                onChange={(e) => {
                  consultarTecnicosByServicio(Number(e.target.value));
                  console.log(tecnicosByServicios?.nombre);
                }}
              >
                {serviciosList.length !== 0
                  ? serviciosList.map((servicio) => {
                      return (
                        <option key={servicio.id} value={Number(servicio.id)}>
                          {servicio.nombre}
                        </option>
                      );
                    })
                  : null}
              </Select>
            </FormControl>
            <FormControl paddingTop={15}>
              <FormLabel htmlFor="tecnicoId">T??cnico</FormLabel>
              <Select
                id="tecnicoId"
                placeholder="Selecciona el T??cnico"
                variant="filled"
                borderColor="twitter.100"
                onChange={(e) => {
                  console.log(e);
                }}
              >
                {tecnicosByServicios?.Tecnico?.length !== 0
                  ? tecnicosByServicios?.Tecnico?.map((tecnico) => {
                      return (
                        <option key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombre}
                        </option>
                      );
                    })
                  : null}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={getAsignarTicketATecnico}
            >
              Asignar
            </Button>
            <Button colorScheme="red" onClick={cerrar}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DesktopLayout>
  );
}

export default TicketVer;
