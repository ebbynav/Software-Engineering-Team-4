import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model

User = get_user_model()


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'avatar_url', 'primary_contact', 'secondary_contact', 'profile_json')


class UpdateProfile(graphene.Mutation):
    class Arguments:
        primary_contact = graphene.String(required=False)
        secondary_contact = graphene.String(required=False)
        avatar_url = graphene.String(required=False)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Authentication required')

        for k, v in kwargs.items():
            if hasattr(user, k) and v is not None:
                setattr(user, k, v)
        user.save()
        return UpdateProfile(user=user)


class Register(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        username = graphene.String(required=False)
        password = graphene.String(required=True)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)

    user = graphene.Field(UserType)
    access_token = graphene.String()
    refresh_token = graphene.String()

    @classmethod
    def mutate(cls, root, info, email, password, username=None, first_name=None, last_name=None):
        UserModel = get_user_model()
        if UserModel.objects.filter(email=email).exists():
            raise Exception('Email already in use')

        user = UserModel.objects.create_user(username=username or email.split('@')[0], email=email, password=password, first_name=first_name or '', last_name=last_name or '')
        user.save()

        # create JWT tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        return cls(user=user, access_token=str(refresh.access_token), refresh_token=str(refresh))


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    access_token = graphene.String()
    refresh_token = graphene.String()

    @classmethod
    def mutate(cls, root, info, email, password):
        from django.contrib.auth import authenticate
        user = authenticate(username=email, password=password)
        if user is None:
            # try authenticate with email field
            try:
                UserModel = get_user_model()
                obj = UserModel.objects.filter(email=email).first()
                if obj and obj.check_password(password):
                    user = obj
            except Exception:
                pass

        if user is None:
            raise Exception('Invalid credentials')

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        return cls(user=user, access_token=str(refresh.access_token), refresh_token=str(refresh))


class Mutation(graphene.ObjectType):
    update_profile = UpdateProfile.Field()
    register = Register.Field()
    login = Login.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            return None
        return user
import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model

User = get_user_model()


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'avatar_url', 'primary_contact', 'secondary_contact', 'profile_json')


class UpdateProfile(graphene.Mutation):
    class Arguments:
        primary_contact = graphene.String(required=False)
        secondary_contact = graphene.String(required=False)
        avatar_url = graphene.String(required=False)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Authentication required')

        for k, v in kwargs.items():
            if hasattr(user, k) and v is not None:
                setattr(user, k, v)
        user.save()
        return UpdateProfile(user=user)


    class Register(graphene.Mutation):
        class Arguments:
            email = graphene.String(required=True)
            username = graphene.String(required=False)
            password = graphene.String(required=True)
            first_name = graphene.String(required=False)
            last_name = graphene.String(required=False)

        user = graphene.Field(UserType)
        access_token = graphene.String()
        refresh_token = graphene.String()

        @classmethod
        def mutate(cls, root, info, email, password, username=None, first_name=None, last_name=None):
            UserModel = get_user_model()
            if UserModel.objects.filter(email=email).exists():
                raise Exception('Email already in use')

            user = UserModel.objects.create_user(username=username or email.split('@')[0], email=email, password=password, first_name=first_name or '', last_name=last_name or '')
            user.save()

            # create JWT tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            return cls(user=user, access_token=str(refresh.access_token), refresh_token=str(refresh))


    class Login(graphene.Mutation):
        class Arguments:
            email = graphene.String(required=True)
            password = graphene.String(required=True)

        user = graphene.Field(UserType)
        access_token = graphene.String()
        refresh_token = graphene.String()

        @classmethod
        def mutate(cls, root, info, email, password):
            from django.contrib.auth import authenticate
            user = authenticate(username=email, password=password)
            if user is None:
                # try authenticate with email field
                try:
                    UserModel = get_user_model()
                    obj = UserModel.objects.filter(email=email).first()
                    if obj and obj.check_password(password):
                        user = obj
                except Exception:
                    pass

            if user is None:
                raise Exception('Invalid credentials')

            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            return cls(user=user, access_token=str(refresh.access_token), refresh_token=str(refresh))


    class Mutation(graphene.ObjectType):
        update_profile = UpdateProfile.Field()
        register = Register.Field()
        login = Login.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            return None
        return user
